--DungeonMap view and functions
module DungeonMap exposing (..)

--elm Packages
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Events
import Svg
import Svg.Attributes as SvgAtt
import Svg.Events
import Json.Decode
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Table as Table
import Array exposing (Array)


--our Modules
import Model exposing (..)

dungeonMapView : Model -> Html Msg
dungeonMapView model =
    Html.section [ class "container is-widescreen" ]
            [ div [ class "section" ]
                  [ Grid.row []
                             [ Grid.col []
                                        [ dungeonMap_Svg model
                                        ]
                             , Grid.col [ Col.xs4 ]
                                        [ dungeonMap_MonsterList model
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
                          , Table.th [] [ Html.text "LeP" ]
                          ]
                      , tbody =
                          Table.tbody []
                            <| characters2rows model.enemy
                      }
        ]

characters2rows : Array.Array Character -> List (Table.Row Msg)
characters2rows chars =
    List.indexedMap
        (\i c ->
            case c of
                Enemy name health _ ->
                    Table.tr [ Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (MonsterIcon (i+1) "0" "0")))) ]
                        [ Table.td [] [Html.text <| String.fromInt (i+1)]
                        , Table.td [] [Html.text name]
                        , Table.td [] [Html.text <| String.fromInt health]
                        ]

                Hero name health ->
                    Table.tr [ Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (PlayerIcon (i+1) "0" "0")))) ]
                        [ Table.td [] [Html.text <| String.fromInt (i+1)]
                        , Table.td [] [Html.text name]
                        , Table.td [] [Html.text <| String.fromInt health]
                        ]
        )
        <| Array.toList chars



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
    List.foldl (++) [] (List.map getAreaParam model.characterList)

getAreaParam : DungeonMap_Character -> List (Svg.Svg Msg)
getAreaParam s =
    let
      xCor = Maybe.withDefault "0" (List.head (String.split "," (getCoord s)))
      yCor = Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s))))
      id = getID s
    in
    case getIcon s of
        "monster" ->
            [ Svg.rect
                [ SvgAtt.id (String.fromInt id)
                , SvgAtt.x xCor
                , SvgAtt.y yCor
                , SvgAtt.width "15"
                , SvgAtt.height "15"
                , SvgAtt.class "MonsterIcon"
                ]
                []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                        , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat xCor) + 7.5))
                        , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat yCor) + 8.75))
                        , SvgAtt.dominantBaseline "middle"
                        ]
                        [ Svg.text (String.fromInt id) ]
            ]

        "player" ->
            [ Svg.circle
                [ SvgAtt.id (String.fromInt id)
                , SvgAtt.cx xCor
                , SvgAtt.cy yCor
                , SvgAtt.r "10"
                , SvgAtt.class "PlayerIcon"
                ]
                []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                        , SvgAtt.x xCor
                        , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat yCor) + 0.75))
                        , SvgAtt.dominantBaseline "middle"
                        ]
                        [ Svg.text (String.fromInt id) ]
            ]
        _ ->
            [ Svg.circle
                [ SvgAtt.id (String.fromInt id)
                , SvgAtt.cx xCor
                , SvgAtt.cy yCor
                , SvgAtt.r "0"
                ]
                []
            ]

getIcon object =
    case object of
        Monster i x y ->
            "monster"

        Player i x y ->
            "player"

getCoord object =
    case object of
        Monster i x y ->
            x ++ "," ++ y

        Player i x y ->
            x ++ "," ++ y

getID object =
    case object of
        Monster i x y ->
            i

        Player i x y ->
            i


mouseDrawEvents : AddCharacterIconState -> List (Svg.Attribute Msg)
mouseDrawEvents addCharacterIcon =
    case addCharacterIcon of
        DrawIcon characterIcon ->
            case characterIcon of
                PlayerIcon i x y ->
                    [ Svg.Events.onClick (AddCharacterIcon (MouseClick characterIcon))
                    , onMouseMove (positionToCircleCenter i)
                    ]

                MonsterIcon i x y ->
                    [ Svg.Events.onClick (AddCharacterIcon (MouseClick characterIcon))
                    , onMouseMove (positionToRectangleCorner i)
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

positionToCircleCenter : Int -> MousePosition -> Msg
positionToCircleCenter i position =
    AddCharacterIcon (MouseDraw (PlayerIcon i (String.fromFloat position.x) (String.fromFloat position.y)))


positionToRectangleCorner : Int -> MousePosition -> Msg
positionToRectangleCorner i position =
    AddCharacterIcon (MouseDraw (MonsterIcon i (String.fromFloat position.x) (String.fromFloat position.y)))


newIconsView : AddCharacterIconState -> List (Svg.Svg Msg)
newIconsView addCharacterIcon =
    case addCharacterIcon of
        DrawIcon characterIcon ->
            [ Svg.g
                []
                [ case characterIcon of
                    PlayerIcon i x y ->
                        Svg.circle
                            [ SvgAtt.cx x
                            , SvgAtt.cy y
                            , SvgAtt.r "10"
                            ]
                            []

                    MonsterIcon i x y ->
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
