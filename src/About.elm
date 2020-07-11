module About exposing (..)

import Html exposing (Html, div, text, br)
import Html.Attributes as Attr exposing (class)

import Model exposing (..)
aboutView : Html Msg
aboutView =
    div[ class "aboutText" ]
    [ Html.h1 [ class "about" ] [ text "Das schwarze Auge Edition 5" ]
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
                Zur Vorbereitung wird die Reihenfolge der Kämpfenden bestimmt. Dazu wird der die Initiative (INI) ausgewürfelt.
                Der Spielleiter würfelt für alle NSCs.
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
                Gleichzeitig wirft der Angegriffene auf PA oder AW. Gelingt die Probe bricht der Angriff an dieser Stelle ab.
            """
        , br [][]
        , text
            """
                War der Angriff erfolgreich und die Verteidigung ein Fehlschlag wird der Schaden berechnet.
                Das ist die Gelegenheit den \"Angriff\"-Button zu klicken.
                Entsprechend der Angabe der Waffe (z.B 1W6+4) wird der Angriffswert erwürfelt.
                Von diesem wird der RS-Wert des Angegriffenen subtrahiert und das Ergebnis von den LeP abgezogen.
            """
        , br [][]
        , text
            """
                Die Berechnung übernimmt der Manager vollständig!
            """
        ]
    , Html.p []
        [ text "Das ist nur eine minimale Zusammfassung, die genauen Regeln können im "
        , Html.a [ Attr.href "http://ulisses-regelwiki.de/index.php/Kampfregeln.html" ] [ text "DSA Regelwiki" ]
        , text " nachgelesen werden."
        ]
    ]