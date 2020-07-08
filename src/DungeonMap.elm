--DungeonMap view and functions
module DungeonMap exposing (..)

--elm Packages
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick)
import Svg
import Svg.Attributes as SvgAtt
import Svg.Events
import Json.Decode
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Table as Table
import Bootstrap.Button as Button
import Bootstrap.Modal as Modal
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Radio as Radio
import Array exposing (Array)
import File
import ColorPicker
import Color

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
                  , Button.button [ Button.info, Button.onClick ClearCharacterList ] [ text "Clear Map" ]
                  , newObjectIconModal model
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
                Enemy name health _ _ _ ->
                    Table.tr [ Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (MonsterIcon (i+1) "-100" "-100")))) ]
                        [ Table.td [] [Html.text <| String.fromInt (i+1)]
                        , Table.td [] [Html.text name]
                        , Table.td [] [Html.text <| String.fromInt health]
                        ]

                Hero name health ->
                    Table.tr [ Table.rowAttr (stopBubbling (AddCharacterIcon (MouseDraw (PlayerIcon (i+1) "-100" "-100")))) ]
                        [ Table.td [] [Html.text <| String.fromInt (i+1)]
                        , Table.td [] [Html.text name]
                        , Table.td [] [Html.text <| String.fromInt health]
                        ]
        )
        <| Array.toList chars



dungeonMap_Svg : Model -> Html Msg
dungeonMap_Svg model =
    div [ class "container"
        , style "border" (if model.hover then "6px dashed purple" else "6px dashed #ccc")
        , hijackOn "dragenter" (Json.Decode.succeed DragEnter)
        , hijackOn "dragover" (Json.Decode.succeed DragEnter)
        , hijackOn "dragleave" (Json.Decode.succeed DragLeave)
        , hijackOn "drop" dropDecoder
        ]
        [ Button.button [ Button.onClick Pick ] [ text "Upload Map" ]
        , Html.figure [ class "image" ]
           [ Svg.svg
                ([ SvgAtt.width "100%", SvgAtt.viewBox "0 0 800 600", SvgAtt.version "1.1" ]
                    ++ mouseDrawEvents model.addCharacterIcon
                    ++  if model.addCharacterIcon==DrawingInactive
                        then [ Svg.Events.onClick (ShowModal ObjectIconModal)
                             ]
                        else []
                )
                ([ Svg.image [ SvgAtt.width "800", SvgAtt.height "600", SvgAtt.title "DungeonMap", SvgAtt.xlinkHref (Maybe.withDefault "" (List.head model.previews)) ] [] ]
                    ++ svgIconList model
                    ++ newIconsView model.addCharacterIcon
                )
           ]
        ]

newObjectIconModal : Model -> Html Msg
newObjectIconModal model =
    Modal.config (CloseModal ObjectIconModal)
        |> Modal.hideOnBackdropClick True
        |> Modal.h3 [] [ text "Neues Icon" ]
        |> Modal.body []
            [ div []
                [ div []
                    ( Radio.radioList "customradiogroup"
                        [ Radio.createCustom [ Radio.id "rdi1", Radio.inline, Radio.onClick (ChangeIcon 1), Radio.checked (1 == model.radioCheckedID) ] "Kiste"
                        , Radio.createCustom [ Radio.id "rdi2", Radio.inline, Radio.onClick (ChangeIcon 2), Radio.checked (2 == model.radioCheckedID) ] "Schlüssel"
                        , Radio.createCustom [ Radio.id "rdi3", Radio.inline, Radio.onClick (ChangeIcon 3), Radio.checked (3 == model.radioCheckedID) ] "Benutzerdefiniert"
                        ]
                    )
                , div []
                    ( [ Html.br [] []
                      , Input.text
                          [ Input.value model.iconText
                          , Input.placeholder "Beschreibung"
                          , Input.onInput ChangeIconText
                          ]
                      ]
                      ++  case model.radioCheckedID of
                              3 -> [ Html.br [] []
                                   , ColorPicker.view model.colour model.colorPicker
                                      |> Html.map ColorPickerMsg
                                   ]
                              _ -> []
                    )
                ]
            ]
            |> Modal.footer []
                [ Button.button
                    [ Button.attrs [onClick <| AddCharacterIcon (MouseClick (getCharIcon model.addCharacterIcon)) ]
                    , Button.success
                    ]
                    [ text "Icon hinzufügen" ]
                ]
            |> Modal.view model.showObjectIconModal

getCharIcon : AddCharacterIconState -> CharacterIcon
getCharIcon state =
    case state of
        DrawIcon charIcon ->
            charIcon

        _ -> ObjectIcon 0 "" "" "" Nothing

stopBubbling : msg -> Svg.Attribute msg
stopBubbling msg =
    Html.Events.stopPropagationOn "click" (Json.Decode.map (\m -> ( m, True )) (Json.Decode.succeed msg))



svgIconList : Model -> List (Svg.Svg Msg)
svgIconList model =
    List.foldl (++) [] (List.map getAreaParam (model.characterList ++ model.objectIconList))

getAreaParam : CharacterIcon -> List (Svg.Svg Msg)
getAreaParam s =
    let
      xCor = Maybe.withDefault "0" (List.head (String.split "," (getCoord s)))
      yCor = Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s))))
      id = getID s
      objectText = getObjectText s      --Text of an ObjectIcon, for other Icons empty
      color = getColor s                --Color of a custom ObjectIcon, for others Nothing
    in
    placeIcon (getIconType s) id xCor yCor color

getColor object =
    case object of
        MonsterIcon i x y ->
            Nothing

        PlayerIcon i x y ->
            Nothing

        ObjectIcon i x y t c ->
            c

getIconPath : Int -> String
getIconPath id =
    case id of
        1 -> "res/icons/chest.png"
        2 -> "res/icons/key.png"
        3 -> "custom"   --a svg-shape rather than an .png file, see placeIcon function
        _ -> ""

getIconType object =
    case object of
        MonsterIcon i x y ->
            "monster"

        PlayerIcon i x y ->
            "player"

        ObjectIcon i x y t c ->
            "object"

getCoord object =
    case object of
        MonsterIcon i x y ->
            x ++ "," ++ y

        PlayerIcon i x y ->
            x ++ "," ++ y

        ObjectIcon i x y t c ->
            x ++ "," ++ y

getID object =
    case object of
        MonsterIcon i x y ->
            i

        PlayerIcon i x y ->
            i

        ObjectIcon i x y t c ->
            i

getObjectText object =
    case object of
        MonsterIcon i x y ->
            ""

        PlayerIcon i x y ->
            ""

        ObjectIcon i x y t c ->
            t


placeIcon : String -> Int -> String -> String -> Maybe Color.Color -> List (Svg.Svg Msg)
placeIcon iconType id x y color =
    case iconType of
        "monster" ->
            [ Svg.image
                [ SvgAtt.width "34"
                , SvgAtt.height "34"
                , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat x) - 17.5))
                , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat y) - 17.5))
                , SvgAtt.title "MonsterIcon"
                , SvgAtt.xlinkHref ("res/icons/enemy.png")
                ] []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat x) - 0.5))
                , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat y) + 1.5))
                , SvgAtt.dominantBaseline "middle"
                ]
                [ Svg.text (String.fromInt id) ]
            ]

        "player" ->
            [ Svg.image
                [ SvgAtt.width "25"
                , SvgAtt.height "25"
                , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat x) - 11.5))
                , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat y) - 11.5))
                , SvgAtt.title "ObjectIcon"
                , SvgAtt.xlinkHref ("res/icons/hero.png")
                ] []
            , Svg.text_ [ SvgAtt.textAnchor "middle"
                , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat x) + 1))
                , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat y) + 2.5))
                , SvgAtt.dominantBaseline "middle"
                ]
                [ Svg.text (String.fromInt id) ]
            ]

        "object" ->
            case getIconPath id of
                "custom" -> [ Svg.circle
                                [ SvgAtt.id (String.fromInt id)
                                , SvgAtt.cx x
                                , SvgAtt.cy y
                                , SvgAtt.r "10"
                                , SvgAtt.style (buildCustomObjectIconStyle color)
                                ]
                                []
                            ]


                _ -> [ Svg.image
                         [ SvgAtt.width "25"
                         , SvgAtt.height "25"
                         , SvgAtt.x (String.fromFloat (Maybe.withDefault 0 (String.toFloat x) - 11.5))
                         , SvgAtt.y (String.fromFloat (Maybe.withDefault 0 (String.toFloat y) - 11.5))
                         , SvgAtt.title "ObjectIcon"
                         , SvgAtt.xlinkHref (getIconPath id)
                         ] []
                     ]

        _ ->
            []

buildCustomObjectIconStyle : Maybe Color.Color -> String
buildCustomObjectIconStyle color =
    "stroke:black;stroke-width:4;fill:" ++ (Color.toCssString (Maybe.withDefault Color.black color))

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

                ObjectIcon i x y t c ->
                    [ Svg.Events.onClick (ShowModal ObjectIconModal)
                    , onMouseMove (positionToIconCenter i)
                    ]

        DrawingInactive ->
                [ onMouseMove (positionToIconCenter 0)
                ]


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

positionToIconCenter : Int -> MousePosition -> Msg
positionToIconCenter i position =
    AddCharacterIcon (MouseDraw (ObjectIcon i (String.fromFloat position.x) (String.fromFloat position.y) "" Nothing ))

newIconsView : AddCharacterIconState -> List (Svg.Svg Msg)
newIconsView addCharacterIcon =
    case addCharacterIcon of
        DrawIcon characterIcon ->
            case characterIcon of
                ObjectIcon i x y t c ->
                    []

                PlayerIcon i x y ->
                    (placeIcon "player" i x y Nothing)
                        ++  [ Svg.rect
                                [ SvgAtt.width "800"
                                , SvgAtt.height "600"
                                , SvgAtt.x "0"
                                , SvgAtt.y "0"
                                , SvgAtt.style "fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"
                                ]
                                []
                            ]

                MonsterIcon i x y ->
                    (placeIcon "monster" i x y Nothing)
                        ++  [ Svg.rect
                                [ SvgAtt.width "800"
                                , SvgAtt.height "600"
                                , SvgAtt.x "0"
                                , SvgAtt.y "0"
                                , SvgAtt.style "fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"
                                ]
                                []
                            ]
        _ ->
            []

dropDecoder : Json.Decode.Decoder Msg
dropDecoder =
  Json.Decode.at ["dataTransfer","files"] (Json.Decode.oneOrMore GotFiles File.decoder)


hijackOn : String -> Json.Decode.Decoder msg -> Html.Attribute msg
hijackOn event decoder =
  Html.Events.preventDefaultOn event (Json.Decode.map hijack decoder)


hijack : msg -> (msg, Bool)
hijack msg =
  (msg, True)
