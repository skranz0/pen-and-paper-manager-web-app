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

--our Modules
import DungeonMap exposing (dungeonMapView)
import FightingTool exposing (..)
import Model exposing (..)

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
            ( { model | enemy = newEnemy }, Cmd.none )

        EnemyLoaded (Err error) ->
            case error of -- We basically just dismiss errors, this could be better
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )

        UpdateEnemy new ->
            ( { model | enemy = new }
            , Cmd.none
            )

        UpdateTmp new ->
            ( { model | tmpEnemy = new }
            , Cmd.none
            )

        CharacterDeath ->
            let
                (name, armor) =
                    case model.enemy of
                        Enemy n _ a -> (n, a)
            in
                (
                    { model | deathAlertVisibility = Modal.shown
                    , enemy = Enemy name 0 armor
                    -- this (+ the let above) makes sure the health of the displayed enemy is set to 0 after it is killed
                    }
                    , Cmd.none
                )

        CloseDeathAlert ->
            ( { model | deathAlertVisibility = Modal.hidden }
            , Cmd.none
            )

        MyDrop1Msg state ->
            ( { model | myDrop1State = state }
            , Cmd.none
            )

        ChangeDamage newDamage -> -- Will eventually be useless after refactor, I just have to get a better feel for let and in
            ( { model | damage = newDamage }
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
                damage = String.fromInt (damageCalc intList model.bonusDamage) 
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
                            ( { model | characterList = Player x y :: model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )

                        MonsterIcon x y ->
                            ( { model | characterList = Monster x y :: model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )

                MouseDraw s ->
                    ( { model | addCharacterIcon = DrawIcon s }, Cmd.none )

        DoNothing ->
            (model, Cmd.none)

view : Model -> Html Msg
view model =
    div []
        [ header
        , Tab.config TabMsg
            |> Tab.items
                [ Tab.item
                    { id = "tabItem1"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Overview" ]
                    , pane =
                        Tab.pane []
                            [ body model ]
                    }
                , Tab.item
                    { id = "tabItem2"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Map" ]
                    , pane =
                        Tab.pane []
                            [ (dungeonMapView model) ] -- Map
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
