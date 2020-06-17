module Main exposing (main)

import Browser
import Html exposing (Html, div, text, h1, h2)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (class)
import Json.Decode
import Http
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Modal as Modal

type alias Model =
    { enemy : Character -- The enemy displayed on the homepage
    , tmpEnemy : Character -- Will eventually be useless after refactor, I just have to get a better feel for let and in
    , showString : String
    , myDrop1State : Dropdown.State
    , damage : String
    , deathAlertVisibility : Modal.Visibility
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

        DoNothing ->
            (model, Cmd.none)

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
        , body model
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