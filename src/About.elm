module About exposing (..)

import Html exposing (Html, div, text, br)
import Html.Attributes as Attr exposing (class)

import Model exposing (..)
aboutView : Html Msg
aboutView =
    div[]
    [ Html.h1 [] [ text "Das schwarze Auge Edition 5" ]
    , Html.h3 [] [ text "Übersicht der Kampfesregeln"]
    , Html.p [] 
        [ text
            """
                Die wenigsten Geschichten im Pen & Paper Rollenspiel DSA kommen ohne einen Kampf aus.
                Die Mechanik unterscheidet sich allerdings etwas vom normalen Spielgeschehen.
            """
        , br [][]
        , text
            """
                Zur Vorbereitung wird die Reihenfolge der Kämpfenden bestimmt. Dazu wird der die Initiative
                (INI) ausgewürfelt. Der Spielleiter würfelt für alle NSCs.
            """
        , br [][]
        , text
            """
                Dieser Reihenfolge nach dürfen die Charaktere jetzt je einen Gegner angreifen.
            """
        ]
    , Html.p []
        [ text 
            """
                Um anzugreifen muss zunächst eine Probe mit einem W20 auf den AT-Wert bestanden werden.
                Gleichzeitig wirft der Angegriffene auf PA oder AW. Ist er damit erfolgreich bricht der Angriff
                an dieser Stelle ab.
            """
        ]
    ]