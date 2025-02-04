import type {
    ApiInitiative,
    InitiativeEffectNew,
    InitiativeEffectRemove,
    InitiativeEffectRename,
    InitiativeEffectTurns,
    InitiativeOptionSet,
} from "../../../apiTypes";
import type { GlobalId } from "../../../core/id";
import type { InitiativeSort } from "../../models/initiative";
import { initiativeStore } from "../../ui/initiative/state";
import { socket } from "../socket";

socket.on("Initiative.Set", (data: ApiInitiative) => initiativeStore.setData(data));
socket.on("Initiative.Active.Set", (isActive: boolean) => initiativeStore.setActive(isActive));
socket.on("Initiative.Remove", (data: GlobalId) => initiativeStore.removeInitiative(data, false));

socket.on("Initiative.Turn.Update", (turn: number) =>
    initiativeStore.setTurnCounter(turn, { sync: false, updateEffects: true }),
);
socket.on("Initiative.Turn.Set", (turn: number) =>
    initiativeStore.setTurnCounter(turn, { sync: false, updateEffects: false }),
);
socket.on("Initiative.Round.Update", (round: number) => initiativeStore.setRoundCounter(round, false));
socket.on("Initiative.Effect.New", (data: InitiativeEffectNew) => {
    initiativeStore.createEffect(data.actor, data.effect, false);
});
socket.on("Initiative.Effect.Rename", (data: InitiativeEffectRename) => {
    initiativeStore.setEffectName(data.shape, data.index, data.name, false);
});
socket.on("Initiative.Effect.Turns", (data: InitiativeEffectTurns) => {
    initiativeStore.setEffectTurns(data.shape, data.index, data.turns, false);
});
socket.on("Initiative.Effect.Remove", (data: InitiativeEffectRemove) =>
    initiativeStore.removeEffect(data.shape, data.index, false),
);
socket.on("Initiative.Option.Set", (data: InitiativeOptionSet) =>
    initiativeStore.setOption(data.shape, data.option, data.value),
);
socket.on("Initiative.Clear", () => initiativeStore.clearValues(false));
socket.on("Initiative.Sort.Set", (sort: InitiativeSort) => initiativeStore.changeSort(sort, false));
