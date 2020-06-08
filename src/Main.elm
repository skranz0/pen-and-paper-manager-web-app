module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html
import Http exposing (expectJson)
import Json.Decode exposing (Decoder)
import List
import Url

main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }
        
init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags urlParam keyParam =
    ( { modal = Nothing
        , key = keyParam
        , url = urlParam
    }
    , Cmd.none 
    )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


type alias Model =
    { modal : Maybe ModalState
    , key : Nav.Key
    , url : Url.Url
    }

type Msg
    = OpenModal ModalMsg
    | CloseModal
    | GotText (Result Http.Error String)
    | JsonLoaded (Result Http.Error (List Shape))
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OpenModal modalMsg ->
            ( updateModal modalMsg model, Cmd.none )

        CloseModal ->
            ( { model | modal = Nothing }, Cmd.none )

        JsonLoaded (Ok newListShapes) ->
            ( { model | saved = newListShapes }, Cmd.none )

        JsonLoaded (Err error) ->
            case error of
                Http.BadBody errorMsg ->
                    ( { model | showString = "Error:  " ++ errorMsg }, Cmd.none )

                _ ->
                    ( { model | showString = "Error:  " }, Cmd.none )

        GotText result ->
            case result of
                Ok fullText ->
                    ( { model | showString = fullText }, Cmd.none )

                Err _ ->
                    ( { model | showString = "error" }, Cmd.none )

        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )
                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            case url.fragment of
                Just "fenster" ->
                    ( {model | url = url}
                    , Http.get
                        { url = "https://cors-anywhere.herokuapp.com/https://users.informatik.uni-halle.de/~hinnebur/fenster-liste.json"
                        , expect = Http.expectJson JsonLoaded (Json.Decode.field "rectangle" (Json.Decode.list parseRectangle))
                        }
                    )
                Just "tueren" ->
                    ( {model | url = url}
                    , Http.get
                        { url = "https://cors-anywhere.herokuapp.com/https://users.informatik.uni-halle.de/~hinnebur/tueren-liste.json"
                        , expect = Http.expectJson JsonLoaded (Json.Decode.field "rectangle" (Json.Decode.list parseRectangle))
                        }
                    )
                _ -> ( {model| url = url}
                    , Cmd.none)

view : Model -> Browser.Document Msg
view model = Browser.Document "shape-document" [ docview model ]

docview : Model -> Html Msg
docview model =
    div []
        [ section [ Html.Attributes.class "hero is-success is-bold" ]
            [ applicationHeader
            ]
        , section [ Html.Attributes.class "section" ]
            [ p [][text "hier könnte ihre Werbung stehen"]
            ]
        ]

applicationHeader : Html Msg
applicationHeader =
    div [ Html.Attributes.class "hero-body" ]
        [ div [ Html.Attributes.class "container animated fadeInDown" ]
            [ h1 [ Html.Attributes.class "title" ] [ text "Pen and Paper Manager" ]
            , h2 [ Html.Attributes.class "subtitle" ] [ text "für DSA Version 5" ]
            ]
        ]

onClickNoBubblingUp : msg -> Attribute msg
onClickNoBubblingUp msg =
    Html.Events.stopPropagationOn "click" (Json.Decode.map (\m -> ( m, True )) (Json.Decode.succeed msg))

type alias MousePosition =
    { x : Float, y : Float }

onMouseMove : (MousePosition -> msg) -> Svg.Attribute msg
onMouseMove mapMousePositionToMsg =
    Svg.Events.on "mousemove" (Json.Decode.map mapMousePositionToMsg offsetMousePosition)

offsetMousePosition : Json.Decode.Decoder MousePosition
offsetMousePosition =
    Json.Decode.map2 MousePosition (Json.Decode.field "offsetX" Json.Decode.float) (Json.Decode.field "offsetY" Json.Decode.float)


viewModal : Model -> Html Msg
viewModal model =
    case model.modal of
        Nothing ->
            span [] []

        Just modalState ->
            div []
                [ case modalState of
                    ShowTable ->
                        showShapesAsTableInModal model.saved

                    InputShape shape ->
                        inputShapeInModal shape

                    ShowShape i s ->
                        showShape i s
                ]


modalHeader : String -> Html Msg
modalHeader title =
    a [ Html.Events.onClick CloseModal ] []


modalFooter : List (Html Msg) -> Html Msg
modalFooter modalButtons =
    div []
        (modalButtons
            ++ [ button [ Html.Events.onClick CloseModal, class "delete is-large", style "margin-top" "10px" ] [] ]
        )


radioActive : msg -> String -> Html msg
radioActive msg key =
    div []
        [ input
            [ type_ "radio"
            , id ("Radio" ++ key)
            , value key
            , name "Shape"
            , Html.Events.onClick msg
            ]
            []
        , label
            [ Html.Attributes.for ("Radio" ++ key)
            , style "margin-left" "5px"
            ]
            [ text key ]
        ]