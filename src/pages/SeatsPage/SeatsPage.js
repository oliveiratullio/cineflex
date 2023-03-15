import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { PageContainer , SeatsContainer ,FormContainer, CaptionContainer, CaptionCircle, CaptionItem, FooterContainer } from "./Styled"
import Seat from "./Seat"
export default function SeatsPage({setSuccessInfo}){
    const {idSessao} = useParams()
    const [session, setSession] = useState(undefined);
    const [selectedSeats, setSelectedSeats] = useState([])
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const navigate = useNavigate();
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
    function buy(e){
        e.preventDefault()
        const ids = selectedSeats.map((s) => s.id)
        const body = { name, cpf , ids }
        const promise = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", body)
        promise.then(res => {
            const info = {
                movie: session.movie.title,
                date: session.day.date,
                hour: session.name,
                buyer: name,
                cpf: cpf,
                seats: selectedSeats.map((s) => s.name)
            }

            setSuccessInfo(info)
            navigate("/sucesso")
        })
        promise.catch((err) => console.log(err.response.data))
    }
    function nameChange(e) {
        setName(e.target.value)
    }
    function cpfChange(e) {
        setCpf(e.target.value)
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

            <FormContainer onSubmit={buy}>
                Nome do Comprador:
                <input data-test="client-name" value={name} onChange={nameChange} required placeholder="Digite seu nome..." />

                CPF do Comprador:
                <input data-test="client-cpf" value={cpf} onChange={cpfChange} required placeholder="Digite seu CPF..." />

                <button data-test="book-seat-btn" type="submit">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
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