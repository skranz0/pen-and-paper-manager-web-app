module About exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes as Attr exposing (class)

import Model exposing (..)
aboutView : Model -> Html Msg
aboutView model =
    div[]
    [ Html.h1 [] [ text "Das schwarze Auge Edition 5" ]
    , Html.h3 [] [ text "Übersicht der Kampfesregeln"]
    , Html.p [] 
        [ text
            """
            Die wenigsten Geschichten im Pen & Paper Rollenspiel DSA kommen ohne einen Kampf aus.
            Die Mechanik unterscheidet sich allerdings etwas vom normalen Spielgeschehen.
            """
        ]
    ]