--FightingTool view and functions
module FightingTool exposing (..)

--elm Packages
import Html exposing (Html, div, text, h1, h2, p)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Json.Decode
import Bootstrap.Modal as Modal
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Table as Table
import Array
import Array.Extra as Array
import Random

--our Modules
import Model exposing (..)
--import Main exposing (update)

body : Model -> Html Msg
body model =
    div []
        [ div []
            [ Table.table
                { options = [ Table.striped, Table.hover ]
                , thead =  Table.simpleThead
                    [ Table.th [] [ text "ID" ]
                    , Table.th [] [ text "Name" ]
                    , Table.th [] [ text "LeP" ]
                    , Table.th [] [ text "RS"]
                    ]
                , tbody =
                    Table.tbody []
                        (displayCharacters model model.enemy )
                }
            ]
        , viewCustomEnemyModal model
        , deathAlert model
        , viewAttackModal model
        , Button.button
            [ Button.outlineSuccess
            , Button.attrs [ onClick (ShowModal AttackModal) ] ]
            [ text "Angriff"]
        , Button.button
            [ Button.outlineSuccess
            , Button.attrs [ onClick (ShowModal CustomEnemy) ] ]
            [ text "Gegner"]
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

viewAttackModal : Model -> Html Msg
viewAttackModal model = 
    div []
        [ Modal.config (CloseModal AttackModal)
            |> Modal.small
            |> Modal.hideOnBackdropClick True
            |> Modal.h3 [] [ text "Angriff" ]
            |> Modal.body [] 
                [ Html.input 
                    [ Attr.type_ "text"
                    , Attr.name "Dice" 
                    , Attr.placeholder model.dice 
                    , Html.Events.onInput ChangeTmpDice
                    ]  []
                , Html.button [ Html.Events.onClick (DiceAndSlice model.tmpdice) ] [ text "Schaden würfeln" ]
                , Html.input
                    [ Attr.type_ "number"
                    , Attr.name "Damage"
                    , Attr.placeholder model.damage
                    , Html.Events.onInput ChangeDamage
                    ] [ ]
                ]
            |> Modal.footer [] []
            |> Modal.view model.showAttackModal
        ]

viewCustomEnemyModal : Model -> Html Msg
viewCustomEnemyModal model =
{-
    This method is super messed up and I really don't want to explain it here.
    If there's is time somewhere I may do an overhaul, but for now it
    just works the way it is.
    It will probably be put in a modal in the future.
-}
    Modal.config (CloseModal CustomEnemy)
        |> Modal.small
        |> Modal.hideOnBackdropClick True
        |> Modal.h3 [] [ text "Gewonnen ☠" ]
        |> Modal.body [] [ 
            div []
                [ dropdownMenu model
                , Html.label [Attr.for "name"] [text "Name"]
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
                , Html.button 
                    [ Html.Events.onClick <| AddEnemy model.tmpEnemy ] 
                    [ text "Hinzufügen" ]
                ]
            ]
        |> Modal.footer [] []
        |> Modal.view model.showCustomEnemy
    

parseEnemy : Json.Decode.Decoder Character
parseEnemy =
    Json.Decode.map3 Enemy
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "health" Json.Decode.int)
        (Json.Decode.field "armor" Json.Decode.int)

displayCharacters : Model -> Array.Array Character -> List (Table.Row Msg) -- show stats of the enemy in a table, will have its glow up later
displayCharacters model chars =
    List.indexedMap
        (\i c ->
            let
                (name, health, armor) =
                    case c of
                        Enemy n h a ->
                            (n,h,a)
            in
                Table.tr []
                [ Table.td[][text <| String.fromInt i]
                , Table.td[][text name]
                , Table.td[][text <| String.fromInt health]
                , Table.td[][text <| String.fromInt armor]
                , Table.td[]
                    [ Button.button 
                        [ Button.success
                        , Button.attrs [onClick <| attack model i 5 ] ] 
                        [ text "Angriff"]
                    ]
                , Table.td[]
                    [ Button.button 
                        [ Button.danger
                        , Button.attrs [onClick <| RemoveEnemy i ] ] 
                        [ text "Löschen"]
                    ]
                ]
        )
        <| Array.toList chars

attack : Model -> Int -> Int -> Msg
attack model id damage =
    case Array.get id model.enemy of
        Just (Enemy name health armor) ->
            if damage > armor then
                if health - damage + armor <= 0 then
                    CharacterDeath id
                else
                    UpdateEnemy id <| Enemy name (health - damage + armor) armor
            else
                DoNothing -- see, it IS necessary
        Nothing -> DoNothing

setDice : String -> List String
setDice set = 
    List.take 1  (String.split "W" set) ++ String.split "+" (Maybe.withDefault "6+0" <| List.head (List.drop 1 (String.split "W" set)))

damageCalc : (List Int) -> Int -> Int
damageCalc randValues bd =
    List.sum randValues + bd

generateRandomList : Int -> Int -> Cmd Msg
generateRandomList rt mf =
    Random.generate NewRandomList (randomListGenerator rt mf)

randomListGenerator : Int -> Int -> Random.Generator (List Int)
randomListGenerator rt mf =
    Random.list rt (Random.int 1 mf)

deathAlert : Model -> Html Msg
deathAlert model =
    Modal.config (CloseModal DeathAlert)
        |> Modal.small
        |> Modal.hideOnBackdropClick True
        |> Modal.h3 [] [ text "Gewonnen ☠" ]
        |> Modal.body [] [ Html.p [] [ text "Das Monster ist besiegt!"] ]
        |> Modal.footer [] []
        |> Modal.view model.showDeathAlert

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