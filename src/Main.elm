module Main exposing (main)

import Browser
import Html exposing (Html, div, text, h1, h2, h4, p)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (class)
import Json.Decode
import Http
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Modal as Modal
import Bootstrap.Tab as Tab
import Bootstrap.Utilities.Spacing as Spacing exposing (mt3)
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Table as Table
import Svg
import Svg.Attributes as SvgAtt
import Svg.Events

type alias Model =
    { enemy : Character -- The enemy displayed on the homepage
    , tmpEnemy : Character -- Will eventually be useless after refactor, I just have to get a better feel for let and in
    , showString : String
    , myDrop1State : Dropdown.State
    , damage : String
    , deathAlertVisibility : Modal.Visibility
    , tabState : Tab.State
    , characterList : List DungeonMap_Character
    , addCharacterIcon : AddCharacterIconState
    }

type Character
    = Enemy String Int Int
    -- can be expanded e.g. with a hero type with name, health, armor and a weapon

init : () -> (Model, Cmd Msg)
init _ =
    (
        { enemy = initEnemy
        , tmpEnemy = initEnemy
        , showString = ""
        , myDrop1State = Dropdown.initialState
        , damage = ""
        , deathAlertVisibility = Modal.hidden
        , tabState = Tab.initialState
        , characterList = []
        , addCharacterIcon = DrawingInactive
        }
    , Cmd.none
    )

initEnemy : Character
initEnemy =
    Enemy "none" 0 0

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Dropdown.subscriptions model.myDrop1State MyDrop1Msg ]



type Msg
    = LoadEnemy String -- call this with the name of the enemy to load its values into the enemy object
    | EnemyLoaded (Result Http.Error Character)
    | UpdateEnemy Character
    | UpdateTmp Character
    | CharacterDeath
    | MyDrop1Msg Dropdown.State
    | ChangeDamage String -- Will eventually be useless after refactor, I just have to get a better feel for let and in
    | CloseDeathAlert
    | DoNothing -- does nothing (yes, this IS necessary)
    | TabMsg Tab.State
    | AddCharacterIcon AddCharacterIconMsg

type AddCharacterIconState
    = DrawingInactive
    | DrawIcon CharacterIcon

type AddCharacterIconMsg
    = MouseDraw CharacterIcon
    | MouseClick CharacterIcon

type DungeonMap_Character
    = Player String String
    | Monster String String

type
    CharacterIcon
    = PlayerIcon String String
    | MonsterIcon String String

type alias MousePosition =
    { x : Float, y : Float }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        LoadEnemy enemy ->
            ( model
            , Http.get
                { url = "./res/"++enemy++".json" -- These are the files for the enemies from the DSA handbook
                , expect =
                    Http.expectJson EnemyLoaded parseEnemy -- takes the necessary values from the JSON and writes it in model.enemy
                }
            )

        EnemyLoaded (Ok newEnemy) ->
            ( { model | enemy = newEnemy }, Cmd.none )

        EnemyLoaded (Err error) ->
            case error of -- We basically just dismiss errors, this could be better
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )

        UpdateEnemy new ->
            ( { model | enemy = new }
            , Cmd.none
            )

        UpdateTmp new ->
            ( { model | tmpEnemy = new }
            , Cmd.none
            )

        CharacterDeath ->
            let
                (name, armor) =
                    case model.enemy of
                        Enemy n _ a -> (n, a)
            in
                (
                    { model | deathAlertVisibility = Modal.shown
                    , enemy = Enemy name 0 armor
                    -- this (+ the let above) makes sure the health of the displayed enemy is set to 0 after it is killed
                    }
                    , Cmd.none
                )

        CloseDeathAlert ->
            ( { model | deathAlertVisibility = Modal.hidden }
            , Cmd.none
            )

        MyDrop1Msg state ->
            ( { model | myDrop1State = state }
            , Cmd.none
            )

        ChangeDamage newDamage -> -- Will eventually be useless after refactor, I just have to get a better feel for let and in
            ( { model | damage = newDamage }
            , Cmd.none
            )

        TabMsg state ->
            ( { model | tabState = state }
            , Cmd.none
            )

        DoNothing ->
            (model, Cmd.none)

        AddCharacterIcon addCharacterIconMsg ->
            case addCharacterIconMsg of
                MouseClick characterIcon ->
                    case characterIcon of
                        PlayerIcon x y ->
                            ( { model | characterList = Player x y :: model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )

                        MonsterIcon x y ->
                            ( { model | characterList = Monster x y :: model.characterList, addCharacterIcon = DrawingInactive }, Cmd.none )

                MouseDraw s ->
                    ( { model | addCharacterIcon = DrawIcon s }, Cmd.none )


--FUNKTIONS

stopBubbling : msg -> Svg.Attribute msg
stopBubbling msg =
    Html.Events.stopPropagationOn "click" (Json.Decode.map (\m -> ( m, True )) (Json.Decode.succeed msg))

svgIconList : Model -> List (Svg.Svg Msg)
svgIconList model =
    List.indexedMap getAreaParam model.characterList

getAreaParam : Int -> DungeonMap_Character -> Svg.Svg Msg
getAreaParam i s =
    case getIcon s of
        "monster" ->
            Svg.rect
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.x (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.y (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.width "15"
                , SvgAtt.height "15"
                , SvgAtt.class "MonsterIcon"
                ]
                []

        "player" ->
            Svg.circle
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.cx (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.cy (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.r "10"
                , SvgAtt.class "PlayerIcon"
                ]
                []
        _ ->
            Svg.circle
                [ SvgAtt.id (String.fromInt i)
                , SvgAtt.cx (Maybe.withDefault "0" (List.head (String.split "," (getCoord s))))
                , SvgAtt.cy (Maybe.withDefault "0" (List.head (List.drop 1 (String.split "," (getCoord s)))))
                , SvgAtt.r "0"
                ]
                []

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


parseEnemy : Json.Decode.Decoder Character
parseEnemy =
    Json.Decode.map3 Enemy
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "health" Json.Decode.int)
        (Json.Decode.field "armor" Json.Decode.int)

displayEnemy : Model -> Html Msg -- show stats of the enemy in a table, will have its glow up later
displayEnemy model =
    case model.enemy of
        Enemy name health armor ->
            div []
                [ Html.table [Attr.style "margin-top" "20px"]
                    [ Html.tr [] [ Html.th[][text "Name"], Html.th[][text "LeP"], Html.th[][text "RS"] ]
                    , Html.tr [] [ Html.td[][text name], Html.td[][text <| String.fromInt health], Html.td[][text <| String.fromInt armor] ]
                    ]
                ]

attack : Model -> Maybe Int -> Msg
attack model damage =
    case damage of
        Just value ->
            case model.enemy of
                Enemy name health armor ->
                    if value > armor then
                        if health - value + armor <= 0 then
                            CharacterDeath
                        else
                            UpdateEnemy <| Enemy name (health - value + armor) armor
                    else
                        DoNothing -- see, it IS necessary
        Nothing ->
            DoNothing

deathAlert : Model -> Html Msg
deathAlert model =
    Modal.config CloseDeathAlert
        |> Modal.small
        |> Modal.hideOnBackdropClick True
        |> Modal.h3 [] [ text "Gewonnen ☠" ]
        |> Modal.body [] [ Html.p [] [ text "Das Monster ist besiegt!"] ]
        |> Modal.footer []
            [ Button.button
                [ Button.outlinePrimary
                , Button.attrs [ onClick CloseDeathAlert ]
                ]
                [ text "Schließen" ]
            ]
        |> Modal.view model.deathAlertVisibility

dropdownMenu : Model -> Html Msg
dropdownMenu model =
    div []
        [ Dropdown.dropdown
            model.myDrop1State
            { options = [ ]
            , toggleMsg = MyDrop1Msg
            , toggleButton =
                Dropdown.toggle [ Button.primary ] [ text "Gegner" ]
            , items =
                -- give a name to the LoadEnemy method and it will pull up the corresponding JSON
                [ Dropdown.header [ text "Kulturschaffender"]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "goblin" ] [ text "Goblin" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "oger" ] [ text "Oger" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "ork" ] [ text "Ork" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "troll" ] [ text "Troll" ]
                , Dropdown.header [ text "Tier"]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "höhlenspinne" ] [ text "Höhlensspinne" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "gruftassel" ] [ text "Gruftassel" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "grimwolf" ] [ text "Grimwolf" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "schwarzbär" ] [ text "Schwarzbär" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "wildschwein" ] [ text "Wildschwein" ]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "wolfsratte" ] [ text "Wolfsratte" ]
                , Dropdown.header [ text "übernatürliches Wesen"]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "krakenmolch" ] [ text "Krakenmolch" ]
                , Dropdown.header [ text "Drache"]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "tatzelwurm" ] [ text "Tatzelwurm" ]
                , Dropdown.header [ text "Pflanze"]
                , Dropdown.buttonItem [ Html.Events.onClick <| LoadEnemy "waldschrat" ] [ text "Waldschrat" ]
                ]
            }
        ]

customEnemy : Model -> Html Msg
customEnemy model =
{-
    This method is super messed up and I really don't want to explain it here.
    If there's is time somewhere I may do an overhaul, but for now it
    just works the way it is.
    It will probably be put in a modal in the future.
-}
    div []
        [ Html.label [Attr.for "name"] [text "Name"]
        , Html.input [Attr.type_ "text", Attr.id "name", Attr.name "name", Html.Events.onInput
            (\n ->
                let
                    (health, armor) =
                        case model.tmpEnemy of
                            Enemy _ h a -> (h,a)
                in
                    UpdateTmp <| Enemy n health armor
            )] []
        , Html.br [] []
        , Html.label [Attr.for "health"] [text "LeP"]
        , Html.input [Attr.type_ "number", Attr.id "health", Attr.name "health", Html.Events.onInput
            (\h ->
                let
                    (name, armor) =
                        case model.tmpEnemy of
                            Enemy n _ a -> (n,a)
                in
                    UpdateTmp <| Enemy name (Maybe.withDefault 1 <| String.toInt h) armor
            )] []
        , Html.br [] []
        , Html.label [Attr.for "armor"] [text "RS"]
        , Html.input [Attr.type_ "number", Attr.id "armor", Attr.name "armor", Html.Events.onInput
            (\a ->
                let
                    (name, health) =
                        case model.tmpEnemy of
                            Enemy n h _ -> (n,h)
                in
                    UpdateTmp <| Enemy name health (Maybe.withDefault 0 <| String.toInt a)
            )] []
        , Html.br [] []
        , Html.button [ Html.Events.onClick <| UpdateEnemy model.tmpEnemy ] [ text "Hinzufügen" ]
        ]

view : Model -> Html Msg
view model =
    div []
        [ header
        , Tab.config TabMsg
            |> Tab.items
                [ Tab.item
                    { id = "tabItem1"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Overview" ]
                    , pane =
                        Tab.pane []
                            [ body model ]
                    }
                , Tab.item
                    { id = "tabItem2"
                    , link = Tab.link [ Spacing.mt3 ] [ text "Map" ]
                    , pane =
                        Tab.pane []
                            [ (mapView model) ] -- Map
                    }
                ]
            |> Tab.view model.tabState
        , footer
        ]

body : Model -> Html Msg
body model =
    div []
        [ dropdownMenu model
        , displayEnemy model
        , Html.input
            [ Attr.type_ "number"
            , Attr.name "Damage"
            , Attr.placeholder "Schaden"
            , Html.Events.onInput ChangeDamage
            ] []
        , Html.button [ Html.Events.onClick <| attack model <| String.toInt model.damage ] [ text "Schaden" ]
        , customEnemy model
        , deathAlert model
        ]


mapView : Model -> Html Msg
mapView model =
    Html.section [ class "container is-widescreen" ]
            [ div [ class "hero is-dark is-bold"]
                  [ div [ class "hero-body" ]
                        [ div [ class "container "]
                              [ h1 [ class "title" ]
                                   [ Html.text "Dungeon-Map-Tool"
                                   ]
                              , h2 [ class "subtitle" ]
                                   [ Html.text "Manage your Dungeon with ease!"]
                              ]
                        ]

                  ]
            , div [ class "section" ]
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
                        ([ Svg.image [ SvgAtt.width "800", SvgAtt.height "600", SvgAtt.title "Informatikgebäude", SvgAtt.xlinkHref "src/dungeons/library_of_ice_lily.png" ] [] ]
                            ++ svgIconList model
                            ++ newIconsView model.addCharacterIcon
                        )
                   ]
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

footer : Html Msg
footer =
    Html.footer [class "footer animate__animated animate__fadeInUp"]
            [ div [class "content has-text-centered"]
                [ Html.p [] [ text "Entwickelt von Laura Spilling, Stefan Kranz, Marcus Gagelmann und Alexander Kampf" ]
                , Html.p [] [ text "Einführung in das World Wide Web" ]
                ]
            ]

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view

        , update = update
        , subscriptions = subscriptions
        }
