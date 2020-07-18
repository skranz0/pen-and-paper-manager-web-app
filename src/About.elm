module About exposing (..)

import Html exposing (Html, div, text, br)
import Html.Attributes as Attr exposing (class)

import Model exposing (..)
aboutView : Html Msg
aboutView =
    div[ class "aboutText" ]
    [ Html.h1 [class "about"] [ text "Übersicht der Kampfesregeln"]
    , Html.p [] 
        [ text
            """
                Die wenigsten Geschichten im Pen & Paper Rollenspiel DSA kommen ohne einen Kampf aus.
                Die Mechanik unterscheidet sich allerdings etwas vom normalen Spielgeschehen.
            """
        , br [][]
        , text
            """
                Zur Vorbereitung wird die Reihenfolge der Kämpfenden bestimmt. Dazu wird die Initiative (INI) ausgewürfelt.
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
                Gleichzeitig wirft der das gewählte Ziel auf PA oder AW. Gelingt die Probe bricht der Angriff an dieser Stelle ab.
            """
        , br [][]
        , text
            """
                War der Angriff erfolgreich und die Verteidigung ein Fehlschlag wird der Schaden berechnet.
                Das ist die Gelegenheit den \"Angriff\"-Button zu klicken.
                Entsprechend der Angabe der Waffe (z.B 1W6+4) wird der Angriffswert erwürfelt.
                Von diesem wird der RS-Wert des Ziels subtrahiert und das Ergebnis von den LeP abgezogen.
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
    
    , Html.h3 [] [ text "Rechtliche Hinweise" ]
    , Html.p []
        [ text 
            """
                Dieses Produkt wurde unter Lizenz erstellt.
                Das Schwarze Auge und sein Logo sowie Aventuria, Dere, Myranor, Riesland, Tharun, Uthuria, The Dark Eye und 
                ihre Logos sind eingetragene Marken von Ulisses Medien und Spiele Distribution GmbH in Deutschland, den U.S.A. und anderen Ländern.
                Ulisses Spiele und sein Logo sind eingetragene Marken der Ulisses Medien und Spiele Distribution GmbH.
            """
        ]
    , Html.p []
        [ text
            """
                Dieses Werk enthält Material, das durch Ulisses Spiele und/oder andere Autoren urheberrechtlich geschützt ist.
                Solches Material wird mit Erlaubnis im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS verwendet.
            """
        ]
    , Html.p []
        [ text
            """
                Alle anderen Originalmaterialien in diesem Werk sind Copyright 2020 von Stefan Kranz, Laura Spilling, Markus Gagelmann und Alexander Kampf
                und werden im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS veröffentlicht.
            """
        ]
    , Html.img 
        [ Attr.src "src/res/DSA5_Scriptorium Aventuris_Logo_DriveThru.jpg"
        , Attr.alt "Scriptorium Aventuris Logo"
        , Attr.style "width" "50%"
        , class "center"
        ] []
    ]