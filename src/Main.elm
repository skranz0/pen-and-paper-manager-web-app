--update function, main view, main function
module Main exposing (main)

--elm Packages
import Browser
import Http
import Html exposing (Html, div, text)
import Bootstrap.Utilities.Spacing as Spacing exposing (mt3)
import Bootstrap.Modal as Modal
import Bootstrap.Tab as Tab
import Bootstrap.Dropdown as Dropdown
import Array
import Array.Extra as Array

--our Modules
import DungeonMap exposing (dungeonMapView)
import FightingTool exposing (..)
import Model exposing (..)
import About exposing (aboutView)
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        LoadEnemy enemy ->
            ( {model | showCustomEnemy = Modal.hidden }
            , Http.get
                { url = "./res/"++enemy++".json" -- These are the files for the enemies from the DSA handbook
                , expect =
                    Http.expectJson EnemyLoaded parseEnemy -- takes the necessary values from the JSON and writes it in model.enemy
                }
            )

        EnemyLoaded (Ok newEnemy) ->
            ( { model | enemy = Array.push newEnemy model.enemy }, Cmd.none )

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
                Enemy _ _ _ ->
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
                        PlayerIcon x y ->
                            ( { model | characterList = model.characterList ++ [Player x y], addCharacterIcon = DrawingInactive }, Cmd.none )

                        MonsterIcon x y ->
                            ( { model | characterList = model.characterList ++ [Monster x y], addCharacterIcon = DrawingInactive }, Cmd.none )

                MouseDraw s ->
                    ( { model | addCharacterIcon = DrawIcon s }, Cmd.none )

        CloseModal modalType->
            case modalType of
                AttackModal -> 
                    ( { model | showAttackModal = Modal.hidden } , Cmd.none )
                
                DeathAlert ->
                    ( { model | showDeathAlert = Modal.hidden } , Cmd.none )

                CustomEnemy ->
                    ( { model | showCustomEnemy = Modal.hidden } , Cmd.none )

        ShowModal modalType->
            case modalType of
                AttackModal -> 
                    ( { model | showAttackModal = Modal.shown } , Cmd.none )
                
                DeathAlert ->
                    ( { model | showDeathAlert = Modal.shown } , Cmd.none )
                    
                CustomEnemy ->
                    ( { model | showCustomEnemy = Modal.shown } , Cmd.none )
        
        ShowAttackModal id->
            ( { model | showAttackModal = Modal.shown , characterId = id} , Cmd.none )

        SwitchEnemyHero string -> 
                    ( {model | enemyHero = string } , Cmd.none )

        DoNothing ->
            (model, Cmd.none)

view : Model -> Html Msg
view model =
    div []
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
                    , link = Tab.link [ Spacing.mt3 ] [ text "Regeln" ]
                    , pane =
                        Tab.pane []
                            [ aboutView model ]
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
