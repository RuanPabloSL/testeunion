export interface Turno {
  id: number;
  iniciado_em: string;
  encerrado_em: string | null;
}

export function rowToTurno(row: {
  id: number;
  iniciado_em: string;
  encerrado_em: string | null;
}): Turno {
  return row;
}

export function formatTurnoHorario(turno: Turno): string {
  const ini = new Date(turno.iniciado_em).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  if (!turno.encerrado_em) return `Desde ${ini}`;
  const fim = new Date(turno.encerrado_em).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  return `${ini} – ${fim}`;
}
