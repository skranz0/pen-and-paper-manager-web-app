module Main exposing (main)

import Browser
import Html exposing (Html, button, div, text, br, h2, ul, li, b, a)
import Html.Events exposing (onClick)
import Html.Attributes exposing (href)

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


view : Model -> Html Msg
view model =
    div []
        [  br [] []
        , h2 [] [ text "Meine Adresse" ]
        , ul [] [ li [] [ b[] [ text "Name: " ], text "Herr/Frau Mustermann" ]
                , li [] [ b[] [ text "Straße und Hausnummer: " ], text "Von-Seckendorff-Platz 1" ]
                , li [] [ b[] [ text "Postleitzahl und Ort: " ], text "06120 Halle" ]
                , li [] [ b[] [ text "Land: " ], text "Deutschland" ]
                , li [] [ b[] [ text "Telefonnummer: " ], text "0345 12345" ]
                , li [] [ b[] [ text "email: " ], a [ href "mailto:mustermann@informatik.uni-halle.de" ] [ text "mustermann@informatik.uni-halle.de" ] ]
                , li [] [ b[] [ text "Web-Seite: " ], a [ href "http://www.informatik.uni-halle.de" ] [ text "http://www.informatik.uni-halle.de" ] ]
                ]
        ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }
