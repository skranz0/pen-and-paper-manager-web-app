module Main exposing (main)

import Browser
import Html exposing (Html, button, div, text, h1, h2)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (href, class)
import Json.Decode
import Http
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown

type alias Model =
    { enemy : Character
    , showString : String
    , myDrop1State : Dropdown.State
    }

type Character
    = Enemy String Int Int

init : () -> (Model, Cmd Msg)
init _ = 
    ( 
        { enemy = initEnemy
        , showString = ""
        , myDrop1State = Dropdown.initialState
        }
    , Cmd.none
    )
    
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Dropdown.subscriptions model.myDrop1State MyDrop1Msg ]

type Msg
    = LoadEnemy String -- call this with the name of the enemy to load its values into the enemy object
    | EnemyLoaded (Result Http.Error Character)
    | MyDrop1Msg Dropdown.State

update : Msg -> Model -> Model
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
        MyDrop1Msg state ->
            ( { model | myDrop1State = state }
            , Cmd.none
            )

        EnemyLoaded (Ok newEnemy) ->
            ( { model | enemy = newEnemy }, Cmd.none )

        EnemyLoaded (Err error) ->
            case error of
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )

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
        [ button [ Html.Events.onClick <| LoadEnemy "ork" ] [ text "Ork laden" ]
        , dropdownMenu model
        , displayEnemy model
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
        , body
        , Html.footer [class "footer animate__animated animate__fadeInUp"]
            [ div [class "content has-text-centered"]
                [ Html.p [] [ text "Entwickelt von Laura Spilling und Stefan Kranz" ]
                , Html.p [] [ text "Einführung in das World Wide Web" ]
                ]
            ]
        ]

body : Html Msg
body =
    div []
        [text "Hier kommt Inhalt rein :)"
        ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }

dropdownMenu : Model -> Html Msg
dropdownMenu model =
    div []
        [ Dropdown.dropdown
            model.myDrop1State
            { options = [ ]
            , toggleMsg = MyDrop1Msg
            , toggleButton =
                Dropdown.toggle [ Button.primary ] [ text "Genger" ]
            , items =
                [ Dropdown.buttonItem [ ] [ text "Ork" ]
                , Dropdown.buttonItem [ ] [ text "Tatzelwurm" ]
                , Dropdown.buttonItem [ ] [ text "Wolfsratte" ]
                ]
            }
        ]
