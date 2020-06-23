--DungeonMap view and functions
module DungeonMap exposing (..)

--elm Packages
import Html exposing (Html, div, h1, h2)
import Html.Attributes as Attr exposing (class)
import Html.Events
import Svg
import Svg.Attributes as SvgAtt
import Svg.Events
import Json.Decode
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Table as Table

--our Modules
import Model exposing (..)

dungeonMapView : Model -> Html Msg
dungeonMapView model =
    Html.section [ class "container is-widescreen" ]
            [ div [ class "section" ]
                  [ Grid.row []
                             [ Grid.col []
                                        [ (dungeonMap_Svg model)
                                        ]
                             , Grid.col [ Col.xs4 ]
                                        [ (dungeonMap_MonsterList model)
                                        ]
                             ]
                  ]
            ]

dungeonMap_MonsterList : Model -> Html Msg
dungeonMap_MonsterList model =
    div [ class "container" ]
        [ Table.table { options = [ Table.striped, Table.hover, Table.bordered, Table.responsive ]
                      , thead =  Table.simpleThead
                          [ Table.th [] [ Html.text "ID" ]
                          , Table.th [] [ Html.text "Name" ]
                          , Table.th [] [ Html.text "HP" ]
                          ]
                      , tbody =
                          Table.tbody []
                          --some filler characters for now
                              [ Table.tr [ (Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (MonsterIcon "0" "0"))))) ]
                                  [ Table.td [] [ Html.text "1" ]
                                  , Table.td [] [ Html.text "Ork" ]
                                  , Table.td [] [ Html.text "35" ]
                                  ]
                              , Table.tr [ (Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (MonsterIcon "0" "0"))))) ]
                                  [ Table.td [] [ Html.text "2" ]
                                  , Table.td [] [ Html.text "Skelett" ]
                                  , Table.td [] [ Html.text "10" ]
                                  ]
                              , Table.tr [ (Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (PlayerIcon "0" "0"))))) ]
                                  [ Table.td [] [ Html.text "3" ]
                                  , Table.td [] [ Html.text "Player 1" ]
                                  , Table.td [] [ Html.text "22" ]
                                  ]
                              ]
                      }
        ]



dungeonMap_Svg : Model -> Html Msg
dungeonMap_Svg model =
    div [ class "container" ]
          [ Html.figure [ class "image" ]
                   [ Svg.svg
                        ([ SvgAtt.width "100%", SvgAtt.viewBox "0 0 800 600", SvgAtt.version "1.1" ]
                            ++ mouseDrawEvents model.addCharacterIcon
                        )
                        ([ Svg.image [ SvgAtt.width "800", SvgAtt.height "600", SvgAtt.title "DungeonMap", SvgAtt.xlinkHref "src/dungeons/library_of_ice_lily.png" ] [] ]
                            ++ svgIconList model
                            ++ newIconsView model.addCharacterIcon
                        )
                   ]
          ]

stopBubbling : msg -> Svg.Attribute msg
stopBubbling msg =
    Html.Events.stopPropagationOn "click" (Json.Decode.map (\m -> ( m, True )) (Json.Decode.succeed msg))

svgIconList : Model -> List (Svg.Svg Msg)
svgIconList model =
    List.foldl (++) [] (List.indexedMap getAreaParam model.characterList)

getAreaParam : Int -> DungeonMap_Character -> List (Svg.Svg Msg)
getAreaParam i s =
    case getIcon s of
        "monster" ->
            [ Svg.rect
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.x (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.y (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.width "15"
                , SvgAtt.height "15"
                , SvgAtt.class "MonsterIcon"
                ]
                []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                        , SvgAtt.x (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                        , SvgAtt.y (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                        , SvgAtt.dominantBaseline "middle"
                        ]
                        [ Svg.text (String.fromInt i) ]
            ]

        "player" ->
            [ Svg.circle
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.cx (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.cy (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.r "10"
                , SvgAtt.class "PlayerIcon"
                ]
                []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                        , SvgAtt.x (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                        , SvgAtt.y (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                        , SvgAtt.dominantBaseline "middle"
                        ]
                        [ Svg.text (String.fromInt i) ]
            ]
        _ ->
            [ Svg.circle
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.cx (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.cy (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.r "0"
                ]
                []
            ]

getIcon object =
    case object of
        Monster x y ->
            "monster"

        Player x y ->
            "player"

getCoord object =
    case object of
        Monster x y ->
            x ++ "," ++ y

        Player x y ->
            x ++ "," ++ y


mouseDrawEvents : AddCharacterIconState -> List (Svg.Attribute Msg)
mouseDrawEvents addCharacterIcon =
    case addCharacterIcon of
        DrawIcon characterIcon ->
            case characterIcon of
                PlayerIcon x y ->
                    [ Svg.Events.onClick (AddCharacterIcon (MouseClick characterIcon))
                    , onMouseMove positionToCircleCenter
                    ]

                MonsterIcon x y ->
                    [ Svg.Events.onClick (AddCharacterIcon (MouseClick characterIcon))
                    , onMouseMove positionToRectangleCorner
                    ]

        _ ->
            []


onMouseMove : (MousePosition -> msg) -> Svg.Attribute msg
onMouseMove mapMousePositionToMsg =
    Svg.Events.on "mousemoveWithCoordinates" (Json.Decode.map mapMousePositionToMsg mousePosition)


mousePosition : Json.Decode.Decoder MousePosition
mousePosition =
    Json.Decode.map2 MousePosition
        (Json.Decode.at [ "detail", "x" ] Json.Decode.float)
        (Json.Decode.at [ "detail", "y" ] Json.Decode.float)

positionToCircleCenter : MousePosition -> Msg
positionToCircleCenter position =
    AddCharacterIcon (MouseDraw (PlayerIcon (String.fromFloat position.x) (String.fromFloat position.y)))


positionToRectangleCorner : MousePosition -> Msg
positionToRectangleCorner position =
    AddCharacterIcon (MouseDraw (MonsterIcon (String.fromFloat position.x) (String.fromFloat position.y)))


newIconsView : AddCharacterIconState -> List (Svg.Svg Msg)
newIconsView addCharacterIcon =
    case addCharacterIcon of
        DrawIcon characterIcon ->
            [ Svg.g
                []
                [ case characterIcon of
                    PlayerIcon x y ->
                        Svg.circle
                            [ SvgAtt.cx x
                            , SvgAtt.cy y
                            , SvgAtt.r "10"
                            ]
                            []

                    MonsterIcon x y ->
                        Svg.rect
                            [ SvgAtt.x x
                            , SvgAtt.y y
                            , SvgAtt.width "15"
                            , SvgAtt.height "15"
                            ]
                            []
                , Svg.rect
                    [ SvgAtt.width "800"
                    , SvgAtt.height "600"
                    , SvgAtt.x "0"
                    , SvgAtt.y "0"
                    , SvgAtt.style "fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"
                    ]
                    []
                ]
            ]

        _ ->
            []
