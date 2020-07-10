--update function, main view, main function
module Main exposing (main)

--elm Packages
import Browser
import Http
import Html exposing (Html, div, text)
import Html.Attributes
import Bootstrap.Utilities.Spacing as Spacing exposing (mt3)
import Bootstrap.Modal as Modal
import Bootstrap.Tab as Tab
import Bootstrap.Dropdown as Dropdown
import Array
import Array.Extra as Array
import Task
import File.Select as Select
import File
import ColorPicker
import Color

--our Modules
import DungeonMap exposing (dungeonMapView)
import FightingTool exposing (..)
import Model exposing (..)
import About exposing (aboutView)
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        LoadEnemy enemy ->
            ( model
            , Http.get
                { url = "./res/"++enemy++".json" -- These are the files for the enemies from the DSA handbook
                , expect =
                    Http.expectJson EnemyLoaded parseEnemy -- takes the necessary values from the JSON and writes it in model.enemy
                }
            )

        EnemyLoaded (Ok newEnemy) ->
            ( { model | tmpEnemy = newEnemy}, Cmd.none )

        EnemyLoaded (Err error) ->
            case error of -- We basically just dismiss errors, this could be better
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )

        UpdateEnemy index new ->
            ( { model | enemy = Array.set index new model.enemy, showAttackModal = Modal.hidden }
            , Cmd.none
            )

        UpdateTmp new ->
            case new of
                Enemy _ _ _ _ _ ->
                    ( { model | tmpEnemy = new }
                    , Cmd.none
                    )
                Hero _ _ ->
                    ( { model | tmpHero = new }
                    , Cmd.none
                    )

        AddEnemy char ->
            ( {model | enemy = Array.push char model.enemy , showCustomEnemy = Modal.hidden}
            , Cmd.none
            )

        RemoveEnemy index ->
            ( { model | enemy = Array.removeAt index model.enemy }
            , Cmd.none
            )

        CharacterDeath index ->
            (
                { model | showDeathAlert = Modal.shown
                , enemy = Array.removeAt index model.enemy
                , showAttackModal = Modal.hidden
                }
                , Cmd.none
            )

        MyDrop1Msg state ->
            ( { model | myDrop1State = state }
            , Cmd.none
            )

        ChangeDamage newDamage -> -- Will eventually be useless after refactor, I just have to get a better feel for let and in
            ( { model | damage = Maybe.withDefault 0 (String.toInt newDamage ) }
            , Cmd.none
            )

        ChangeTmpDice newTmpDice ->
            ( { model | tmpdice = newTmpDice}
            , Cmd.none
            )

        ChangeIconText newIconText ->
            ( { model | iconText = newIconText}
            , Cmd.none
            )

        ChangeIcon id ->
            case model.addCharacterIcon of
                DrawIcon (ObjectIcon i x y t c ident) ->
                    case id of
                        3 -> ( { model | addCharacterIcon = DrawIcon (ObjectIcon id x y t c ident)
                                       , radioCheckedID = id }
                             , Cmd.none
                             )

                        _ -> ( { model | addCharacterIcon = DrawIcon (ObjectIcon id x y t Nothing ident)
                                       , radioCheckedID = id }
                             , Cmd.none
                             )

                _ -> ( model, Cmd.none )

        DiceAndSlice newDice ->
            let
                rt = Maybe.withDefault 0 (String.toInt (Maybe.withDefault "0" (List.head (setDice newDice))))
                mf = Maybe.withDefault 0 (String.toInt (Maybe.withDefault "6" (List.head <| List.drop 1 (setDice newDice))))
                bd = Maybe.withDefault 0 (String.toInt (Maybe.withDefault "0" (List.head <| List.drop 2 (setDice newDice))))
            in
                ( { model |
                    dice = newDice ,
                    maxFace = mf ,
                    bonusDamage = bd
                    }
                , generateRandomList rt mf
                )

        NewRandomList intList ->
            ( { model |
                dieFaces = intList ,
                damage = damageCalc intList model.bonusDamage
                }
            , Cmd.none
            )

        TabMsg state ->
            ( { model | tabState = state }
            , Cmd.none
            )

        AddCharacterIcon addCharacterIconMsg ->
            case addCharacterIconMsg of
                MouseClick characterIcon ->
                    case characterIcon of
                        PlayerIcon i x y n ->
                            if List.length model.characterList == List.length (List.filter (isNotId i) model.characterList)     --wenn character mit ID noch nicht in Liste
                            then    ( { model | characterList = model.characterList ++ [ characterIcon ], addCharacterIcon = DrawingInactive }, Cmd.none )
                            else    ( { model | addCharacterIcon = DrawingInactive }, Cmd.none )

                        MonsterIcon i x y n ->
                            if List.length model.characterList == List.length (List.filter (isNotId i) model.characterList)     --wenn character mit ID noch nicht in Liste
                            then    ( { model | characterList = model.characterList ++ [ characterIcon ], addCharacterIcon = DrawingInactive }, Cmd.none )
                            else    ( { model | addCharacterIcon = DrawingInactive }, Cmd.none )

                        ObjectIcon i x y t c ident ->
                            ( { model | objectIconList = (generateObjectIdents (model.objectIconList ++ [ ObjectIcon i x y model.iconText (Just model.colour) ident ]))
                                      , addCharacterIcon = DrawingInactive
                                      , showObjectIconModal = Modal.hidden
                                      , iconText = ""
                                      , radioCheckedID = 0
                              }, Cmd.none )

                MouseDraw characterIcon ->
                    case characterIcon of
                        PlayerIcon i x y name ->
                            if List.length model.characterList > List.length (List.filter (isNotId i) model.characterList)     --wenn character mit ID bereits in Liste
                            then    ( { model | characterList = List.filter (isNotId i) model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )
                            else    ( { model | addCharacterIcon = DrawIcon (PlayerIcon i x y name) }, Cmd.none )

                        MonsterIcon i x y name ->
                            if List.length model.characterList > List.length (List.filter (isNotId i) model.characterList)     --wenn character mit ID bereits in Liste
                            then    ( { model | characterList = List.filter (isNotId i) model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )
                            else    ( { model | addCharacterIcon = DrawIcon (MonsterIcon i x y name) }, Cmd.none )

                        ObjectIcon i x y t c ident ->
                            ( { model | addCharacterIcon = DrawIcon (ObjectIcon i x y t c ident) }, Cmd.none )

                    --( { model | addCharacterIcon = DrawIcon s, characterList = (giveDungeonMap_CharacterIds model.characterList) }, Cmd.none )

        ClearCharacterList ->
            ( { model | characterList = [], objectIconList = [] }
            , Cmd.none
            )

        CloseModal modalType->
            case modalType of
                AttackModal ->
                    ( { model | showAttackModal = Modal.hidden } , Cmd.none )

                DeathAlert ->
                    ( { model | showDeathAlert = Modal.hidden } , Cmd.none )

                CustomEnemy ->
                    ( { model | showCustomEnemy = Modal.hidden } , Cmd.none )

                ObjectIconModal ->
                    ( { model | showObjectIconModal = Modal.hidden } , Cmd.none )

        ShowModal modalType->
            case modalType of
                AttackModal ->
                    ( { model | showAttackModal = Modal.shown } , Cmd.none )

                DeathAlert ->
                    ( { model | showDeathAlert = Modal.shown } , Cmd.none )

                CustomEnemy ->
                    ( { model | showCustomEnemy = Modal.shown } , Cmd.none )

                ObjectIconModal ->
                    ( { model | showObjectIconModal =   if model.mouseInIcon then Modal.hidden else Modal.shown
                              , mouseInIcon = False }
                    , Cmd.none )

        ShowAttackModal id->
            ( { model | showAttackModal = Modal.shown , characterId = id} , Cmd.none )

        SwitchEnemyHero string ->
                    ( {model | enemyHero = string } , Cmd.none )

        DoNothing ->
            (model, Cmd.none)

        Pick ->
            ( model
            , Select.files ["image/*"] GotFiles
            )

        DragEnter ->
            ( { model | hover = True }
            , Cmd.none
            )

        DragLeave ->
            ( { model | hover = False }
            , Cmd.none
            )
        GotFiles file files ->
            ( { model | hover = False }
            , Task.perform GotPreviews <| Task.sequence <|
                List.map File.toUrl (file :: files)
                )
        GotPreviews urls ->
            ( { model | previews = urls }
            , Cmd.none
            )

        ColorPickerMsg cpMsg ->
            case model.addCharacterIcon of
                DrawIcon (ObjectIcon i x y t c ident) ->    let
                                                                ( m, colour ) = ColorPicker.update cpMsg model.colour model.colorPicker
                                                            in
                                                            ( { model | colorPicker = m
                                                                      , colour = colour |> Maybe.withDefault model.colour
                                                              }
                                                            , Cmd.none
                                                            )

                _ -> ( model, Cmd.none )

        ToolTipMsg tooltip ->
            case tooltip of
                "" ->   ( { model | activeTooltip = "Beschreibung"
                                  , mouseInIcon = (if tooltip=="Beschreibung" then False else True) }
                        , Cmd.none
                        )

                _ ->    ( { model | activeTooltip = tooltip
                                  , mouseInIcon = (if tooltip=="Beschreibung" then False else True) }
                        , Cmd.none
                        )

        HighlightTableRow id name ->
            ( { model | highlightedTableRow = id
                      , activeTooltip = name
                      , mouseInIcon = (if id==0 then False else True) }
            , Cmd.none
            )

        DeleteIcon iconType id ->
            case iconType of
                "object" ->
                    ( { model | objectIconList = List.filter (isNotId id) model.objectIconList
                              , activeTooltip = "Beschreibung" }
                    , Cmd.none
                    )


                _ ->
                    ( { model | characterList = List.filter (isNotId id) model.characterList
                              , highlightedTableRow = 0
                              , activeTooltip = "Beschreibung" }
                    , Cmd.none
                    )

view : Model -> Html Msg
view model =
    div [Html.Attributes.class "body"]
        [ header
        , Tab.config TabMsg
            |> Tab.items
                [ Tab.item
                    { id = "tabOverview"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Overview" ]
                    , pane =
                        Tab.pane []
                            [ body model ]
                    }
                , Tab.item
                    { id = "tabMap"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Map" ]
                    , pane =
                        Tab.pane []
                            [ dungeonMapView model ] -- Map
                    }
                , Tab.item
                    { id = "tabAbout"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Info" ]
                    , pane =
                        Tab.pane []
                            [ aboutView ]
                    }
                ]
            |> Tab.view model.tabState
        , footer
        ]

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Dropdown.subscriptions model.myDrop1State MyDrop1Msg ]

giveDungeonMap_CharacterIds : List CharacterIcon -> List CharacterIcon
giveDungeonMap_CharacterIds charList =
    List.indexedMap putIdInCharIcon charList

putIdInCharIcon : Int -> CharacterIcon -> CharacterIcon
putIdInCharIcon id charIcon =
    case charIcon of
        PlayerIcon _ x y n -> PlayerIcon (id+1) x y n
        MonsterIcon _ x y n -> MonsterIcon (id+1) x y n
        ObjectIcon _ x y t c ident -> ObjectIcon (id+1) x y t c ident

isNotId : Int -> CharacterIcon -> Bool
isNotId id s =
    case s of
        MonsterIcon i _ _ _ ->
            id/=i

        PlayerIcon i _ _ _ ->
            id/=i

        ObjectIcon _ _ _ _ _ ident ->
            id/=ident

generateObjectIdents : List CharacterIcon -> List CharacterIcon
generateObjectIdents list =
    List.indexedMap
        (\id char ->
            case char of
                ObjectIcon typeID x y t c ident ->
                    ObjectIcon typeID x y t c (id+1)

                _ ->
                    ObjectIcon 0 "" "" "" Nothing 0
        ) list
