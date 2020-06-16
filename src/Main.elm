module Main exposing (main)

import Browser
import Html exposing (Html, div, text, h1, h2)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (class)
import Json.Decode
import Http
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Modal as Modal

type alias Model =
    { enemy : Character
    , showString : String
    , myDrop1State : Dropdown.State
    , damage : String
    , deathAlertVisibility : Modal.Visibility
    }

type Character
    = Enemy String Int Int

init : () -> (Model, Cmd Msg)
init _ = 
    ( 
        { enemy = initEnemy
        , showString = ""
        , myDrop1State = Dropdown.initialState
        , damage = ""
        , deathAlertVisibility = Modal.hidden
        }
    , Cmd.none
    )

initEnemy : Character
initEnemy =
    Enemy "none" 0 0

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Dropdown.subscriptions model.myDrop1State MyDrop1Msg ]



type Msg
    = LoadEnemy String -- call this with the name of the enemy to load its values into the enemy object
    | EnemyLoaded (Result Http.Error Character)
    | UpdateEnemy Character
    | CharacterDeath
    | MyDrop1Msg Dropdown.State
    | ChangeDamage String
    | CloseDeathAlert
    | DoNothing

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        LoadEnemy enemy ->
            ( model
            , Http.get
                { url = "./res/"++enemy++".json"
                , expect =

                    Http.expectJson EnemyLoaded parseEnemy
                }
            )

        EnemyLoaded (Ok newEnemy) ->
            ( { model | enemy = newEnemy }, Cmd.none )

        EnemyLoaded (Err error) ->
            case error of
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )
        
        UpdateEnemy afterAttack ->
            ( { model | enemy = afterAttack }
            , Cmd.none
            )
        
        CharacterDeath ->
            ( { model | deathAlertVisibility = Modal.shown }
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

        ChangeDamage newDamage -> 
            ( { model | damage = newDamage }
            , Cmd.none
            )

        DoNothing ->
            (model, Cmd.none)

parseEnemy : Json.Decode.Decoder Character
parseEnemy =
    Json.Decode.map3 Enemy
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "health" Json.Decode.int)
        (Json.Decode.field "armor" Json.Decode.int)

displayEnemy : Model -> Html Msg
displayEnemy model =
    case model.enemy of
        Enemy name health armor ->
            div []
                [ Html.table [Attr.style "margin-top" "20px"] 
                    [ Html.tr [] [ Html.th[][text "Name"], Html.th[][text "LeP"], Html.th[][text "RS"] ]
                    , Html.tr [] [ Html.td[][text name], Html.td[][text <| String.fromInt health], Html.td[][text <| String.fromInt armor] ]
                    ]
                ]

attack : Model -> Maybe Int -> Msg
attack model damage =
    case damage of
        Just value ->
            case model.enemy of
                Enemy name health armor ->
                    if value > armor then
                        if health - value + armor <= 0 then
                            CharacterDeath
                        else
                            UpdateEnemy <| Enemy name (health - value + armor) armor
                    else
                        DoNothing
        Nothing -> 
            DoNothing

deathAlert : Model -> Html Msg
deathAlert model =
    Modal.config CloseDeathAlert
        |> Modal.small
        |> Modal.hideOnBackdropClick True
        |> Modal.h3 [] [ text "Gewonnen ☠" ]
        |> Modal.body [] [ Html.p [] [ text "Das Monster ist besiegt!"] ]
        |> Modal.footer []
            [ Button.button
                [ Button.outlinePrimary
                , Button.attrs [ onClick CloseDeathAlert ]
                ]
                [ text "Schließen" ]
            ]
        |> Modal.view model.deathAlertVisibility
      
dropdownMenu : Model -> Html Msg
dropdownMenu model =
    div []
        [ Dropdown.dropdown
            model.myDrop1State
            { options = [ ]
            , toggleMsg = MyDrop1Msg
            , toggleButton =
                Dropdown.toggle [ Button.primary ] [ text "Gegner" ]
            , items =
                [ Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "goblin" ] [ text "Goblin" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "oger" ] [ text "Oger" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "ork" ] [ text "Ork" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "troll" ] [ text "Troll" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "höhlenspinne" ] [ text "Höhlensspinne" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "gruftassel" ] [ text "Gruftassel" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "krakenmolch" ] [ text "Krakenmolch" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "tatzelwurm" ] [ text "Tatzelwurm" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "wolfsratte" ] [ text "Wolfsratte" ]
                ]
            }
        ]

view : Model -> Html Msg
view model =
    div []
        [ header
        , body model
        , footer
        ]

body : Model -> Html Msg
body model =
    div []
        [ dropdownMenu model
        , displayEnemy model
        , Html.input 
            [ Attr.type_ "number"
            , Attr.name "Damage" 
            , Attr.placeholder "Schaden"
            , Html.Events.onInput ChangeDamage
            ]  []
        , Html.button [ Html.Events.onClick <| attack model <| String.toInt model.damage ] [ text "Schaden" ]
        , deathAlert model
        ]

header : Html Msg
header =
    Html.section [class "hero is-primary is-bold animate__animated animate__fadeInDown"]
            [ div [class "hero-body"]
                [ div [class "container"]
                    [ h1 [class "title"] [text "Pen & Paper Manager"]
                    , h2 [class "subtitle"] [text "Für \"Das schwarze Auge\" Version 5"]
                    ]
                ]
            ]

footer : Html Msg
footer =
    Html.footer [class "footer animate__animated animate__fadeInUp"]
            [ div [class "content has-text-centered"]
                [ Html.p [] [ text "Entwickelt von Laura Spilling und Stefan Kranz" ]
                , Html.p [] [ text "Einführung in das World Wide Web" ]
                ]
            ]

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view

        , update = update
        , subscriptions = subscriptions
        }