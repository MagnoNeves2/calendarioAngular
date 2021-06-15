import { EventInput, EventSourceInput } from "@fullcalendar/angular";

export class Compromissos {

    public id!: number;
    public groupId?: string;
    public title!: string;
    public start?: string;
    public end?: string;
    public date?: string;
    public backgroundColor?: string;
    public borderColor?: string;

    toModel(compromissos: Compromissos[]): EventSourceInput {
        let lista = [];
        compromissos.forEach((compromisso) => {
            let evento: EventInput = {
                id: compromisso.id.toString(),
                title: compromisso.title,
                start: compromisso.start,
                end: compromisso.end,
                date: compromisso.date
            }

            lista.push(evento);
        })

        let retorno: EventSourceInput = lista;
        return retorno;
    }

}