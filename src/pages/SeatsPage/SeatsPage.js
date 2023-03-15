import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { PageContainer , SeatsContainer ,FormContainer, CaptionContainer, CaptionCircle, CaptionItem, SeatItem, FooterContainer } from "./Styled"
import Seat from "./Seat"
export default function SeatsPage(props){
    const {idSessao} = useParams()
    const [session, setSession] = useState(undefined);
    const [selectedSeats, setSelectedSeats] = useState([])
    const [status, setStatus] = useState("available")
    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`)
        promise.then((res) => {
            setSession(res.data)
        })
        promise.catch((err) => console.log(err.response.data))
    },[])
    if(session === undefined){
        return(
            <PageContainer>
                Carregando...
            </PageContainer>
        )
    }
   
    function clickedSeat(seat) {
        if (!seat.isAvailable) {
            alert("Esse assento não está disponível")
        } else {
            const isSelected = selectedSeats.some((s) => s.id === seat.id)

            if (isSelected) {
                const selectedArray = selectedSeats.filter((s) => s.id !== seat.id)
                setSelectedSeats(selectedArray)
            } else {
                setSelectedSeats([...selectedSeats, seat])
            }
        }
    }
    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {session.seats.map((seat) => (
                    <Seat
                        key={seat.id}
                        seat={seat}
                        clickedSeat={() => clickedSeat(seat)}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                    />
                ))}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle status={"selected"} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle status={"available"} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle status={"unavailable"} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                Nome do Comprador:
                <input placeholder="Digite seu nome..." />

                CPF do Comprador:
                <input placeholder="Digite seu CPF..." />

                <button>Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer>
                <div>
                    <img src={session.movie.posterURL} alt={session.movie.title} />
                </div>
                <div>
                    <p>{session.movie.title}</p>
                    <p>{session.day.weekday} - {session.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}