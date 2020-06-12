module Main exposing (main)

import Browser
import Html exposing (Html, button, div, text, br, h1, h2, ul, li, b, a)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (href, class)

type alias Model =
    { count : Int }


initialModel : Model
initialModel =
    { count = 0 }


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> Model
update msg model =
    case msg of
        Increment ->
            { model | count = model.count + 1 }

        Decrement ->
            { model | count = model.count - 1 }


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
        [ div [][ button [ Html.Events.onClick <| LoadEnemy "ork" ] [ text "Ork laden" ] ]
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
