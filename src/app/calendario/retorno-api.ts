import { EventSourceInput } from "@fullcalendar/angular";
import { CompromissosService } from "../service/compromissos.service"

export function salve(service: CompromissosService): EventSourceInput {
    return service.criarEventos();
}