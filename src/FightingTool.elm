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
import Bootstrap.Form as Form
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Form.Input as Input
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
                    , Table.th [ Table.cellAttr <| Attr.colspan 2 ] [ text "Name" ]
                    , Table.th [] [ text "RS" ]
                    , Table.th [] [ text "LeP"]
                    , Table.th [] [ text " "]
                    , Table.th [] [ text " "]
                    ]
                , tbody =
                    Table.tbody []
                        (displayCharacters model.enemy ++ 
                        [Table.tr [] 
                            [ Table.td[Table.cellAttr <| Attr.colspan 10] -- naja um sicher zu gehen
                                [ Button.button 
                                    [ Button.light
                                    , Button.block
                                    , Button.attrs [onClick <| ShowModal CustomEnemy ] 
                                    ]
                                    [ text "+"]
                                ] 
                            ] 
                        ]  
                        ) 
                }
            ]
        , viewCustomEnemyModal model
        , deathAlert model
        , viewAttackModal model
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
    let
        insideInput = 
            case model.damage of
                0 -> Input.placeholder "Schaden"
                _ -> Input.value <| String.fromInt model.damage
    in
        
    div []
        [ Modal.config (CloseModal AttackModal)
            |> Modal.hideOnBackdropClick True
            |> Modal.h3 [] [ text "Angriff" ]
            |> Modal.body [] 
                [ Input.text
                    [ Input.value model.dice
                    , Input.placeholder "1W6+0"
                    , Input.onInput ChangeTmpDice
                    ] 
                , Button.button 
                    [ Button.attrs [onClick (DiceAndSlice model.tmpdice) ]
                    , Button.outlineDark
                    ]
                    [ text "Schaden würfeln" ]
                , Input.number
                    [ insideInput 
                    , Input.onInput ChangeDamage
                    ]
                ]
            |> Modal.footer [] 
                [ Button.button 
                    [ Button.attrs [onClick <| attack model model.characterId model.damage]
                    , Button.success
                    ] 
                    [ text "Schaden zufügen" ]
                ]
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
    let
        enemybool =  
            case model.enemyHero of
               "Enemy" ->  True
               _ -> False
        herobool = 
            case model.enemyHero of
               "Hero" ->  True
               _ -> False


    in 
        Modal.config (CloseModal CustomEnemy)
            |> Modal.hideOnBackdropClick True
            |> Modal.h3 [] [ text "Charakter hinzufügen" ]
            |> Modal.body [] [ 
                div []
                    [ dropdownMenu model
                    , Html.br [] []
                    , Fieldset.config
                        |> Fieldset.asGroup
                        |> Fieldset.legend [] [ text "Benutzerdefiniert: " ]
                        |> Fieldset.children
                            ( Radio.radioList "EnemyHero"
                                [ Radio.create
                                    [ Radio.id "enemy" 
                                    , Radio.onClick <| SwitchEnemyHero "Enemy"
                                    , Radio.checked enemybool
                                    ] "Gegner"
                                , Radio.create 
                                    [ Radio.id "hero" 
                                    , Radio.onClick <| SwitchEnemyHero "Hero"
                                    , Radio.checked herobool
                                    ] "Held"
                                ]
                            )
                        |> Fieldset.view
                    , if model.enemyHero == "Hero" 
                        then customHero model
                        else if model.enemyHero == "Enemy" 
                            then customEnemy model
                            else p [][]
                    ] 
            ]    
            |> Modal.footer [] []
            |> Modal.view model.showCustomEnemy
    

parseEnemy : Json.Decode.Decoder Character
parseEnemy =
    Json.Decode.map4 (\n h m s -> Enemy n h m s [])
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "health" Json.Decode.int) -- health and maxHealth have the same value on creation
        (Json.Decode.field "health" Json.Decode.int) 
        (Json.Decode.field "armor" Json.Decode.int)
        

displayCharacters : Array.Array Character -> List (Table.Row Msg) -- show stats of the enemy in a table, will have its glow up later
displayCharacters chars =
    List.indexedMap
        (\i c ->
            let
                {name, health, armor, status} =
                    case c of
                        Enemy n h _ a s ->
                            { name = n
                            , health = h
                            , armor = a
                            , status = s
                            }
                        Hero n a ->
                            { name = n
                            , health = 0
                            , armor = a
                            , status = []
                            }
            in
                case c of
                    Enemy _ _ _ _ _ ->
                        Table.tr []
                        [ Table.td[][text <| String.fromInt (i+1)]
                        , Table.td[][text name]
                        , Table.td[][text <| List.foldl (++) "" status]
                        , Table.td[][text <| String.fromInt armor]
                        , Table.td[][text <| String.fromInt health]
                        , Table.td[]
                            [ Button.button 
                                [ Button.success
                                , Button.attrs [onClick <| ShowAttackModal i]]
                                [ text "Angriff"]
                            ]
                        , Table.td[]
                            [ Button.button 
                                [ Button.danger
                                , Button.attrs [onClick <| RemoveEnemy i ] ] 
                                [ text "Löschen"]
                            ]
                        ]
                    Hero _ _ ->
                        Table.tr []
                        [ Table.td[][text <| String.fromInt (i+1) ]
                        , Table.td[][text name]
                        , Table.td[][text <| String.fromInt armor]
                        , Table.td[][text <| ""]
                        , Table.td[]
                            [ 
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
        Just (Enemy name health maxHealth armor status) ->
            if damage > armor then
                if health - damage + armor <= 0 then
                    CharacterDeath id
                else
                    if (toFloat <| health - damage) <= 0.25 * toFloat maxHealth then
                        UpdateEnemy id <| Enemy name (health - damage + armor) maxHealth armor ("I"::status)
                    else if (toFloat <| health - damage) <= 0.5 * toFloat maxHealth then
                        UpdateEnemy id <| Enemy name (health - damage + armor) maxHealth armor ("I"::status)
                    else if (toFloat <| health - damage) <= 0.75 * toFloat maxHealth then
                        UpdateEnemy id <| Enemy name (health - damage + armor) maxHealth armor ("Schmerz I"::status)
                    else UpdateEnemy id <| Enemy name (health - damage + armor) maxHealth armor status
            else
                CloseModal AttackModal -- see, it IS necessary
        Just (Hero _ _) -> DoNothing
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
            { options = [ Dropdown.dropRight ]
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
    let 
        (ddName, ddHealth, ddArmor) =
            case model.tmpEnemy of
                Enemy n h _ a _ ->              
                    case n of
                        "none" -> (Input.placeholder "", Input.placeholder "", Input.placeholder "")
                        _ -> (Input.value n, Input.value <| String.fromInt h, Input.value <| String.fromInt a)
                Hero _ _ -> (Input.placeholder "", Input.placeholder "", Input.placeholder "") 
        
    in  
        div []
            [ Form.label [] [text "Name:"]
            , Input.text [Input.onInput 
                (\n -> 
                    let 
                        {health, maxHealth, armor, status} =
                            case model.tmpEnemy of
                                Enemy _ h m a s ->
                                    { health = h
                                    , maxHealth = m
                                    , armor = a
                                    , status = s
                                    }
                                _ -> 
                                    { health = 0
                                    , maxHealth = 0
                                    , armor = 0
                                    , status = []
                                    }
                        in 
                            UpdateTmp <| Enemy n health maxHealth armor status
                )
                , ddName
                ]       
            , Html.br [] []
            , Form.label [] [text "LeP:"]
            , Input.number [Input.onInput
                (\h -> 
                    let 
                        (name, armor, status) =
                            case model.tmpEnemy of
                                Enemy n _ _ a s -> (n,a,s)
                                _ -> ("",0,[])
                    in 
                        UpdateTmp <| Enemy name (Maybe.withDefault 1 <| String.toInt h) (Maybe.withDefault 1 <| String.toInt h) armor status
                )
                , ddHealth
                ]
            , Html.br [] []
            , Form.label [] [text "RS:"]
            , Input.number [Input.onInput
                (\a -> 
                    let 
                        {name, health, maxHealth, status} =
                            case model.tmpEnemy of
                                Enemy n h m _ s -> 
                                    { name = n
                                    , health = h
                                    , maxHealth = m
                                    , status = s
                                    }
                                _ -> 
                                    { name = ""
                                    , health = 0
                                    , maxHealth = 0
                                    , status = []
                                    }
                    in 
                        UpdateTmp <| Enemy name health maxHealth (Maybe.withDefault 0 <| String.toInt a) status
                )
                , ddArmor
                ]
            , Html.br [] []
            , Button.button 
                [ Button.success
                , Button.attrs [ onClick <| AddEnemy model.tmpEnemy  ] 
                ] [ text "Hinzufügen"]
            ] 

customHero : Model -> Html Msg
customHero model =
    div []
        [ Form.label [] [text "Name"]
        , Input.text [Input.onInput 
            (\n -> 
                let 
                    armor =
                        case model.tmpHero of
                            Hero _ a -> a
                            _ -> 0
                in 
                    UpdateTmp <| Hero n armor
            )]
        , Html.br [] []
        , Form.label [] [text "RS"]
        , Input.number [Input.onInput
            (\a -> 
                let 
                    name =
                        case model.tmpHero of
                            Hero n _ -> n
                            _ -> ""
                in 
                    UpdateTmp <| Hero name (Maybe.withDefault 0 <| String.toInt a)
            )]
        , Html.br [] []
        , Button.button 
            [ Button.success
            , Button.attrs [ onClick <| AddEnemy model.tmpHero  ] 
            ] [ text "Hinzufügen"]
        ]