export type WordPoolSource='due'|'level'|'saved';
type SeenAttempt={mode:'recognition'|'recall';correct:boolean;assisted:boolean;at:string};

/** Due lists shrink after successful reviews; a fixed page offset would skip their next entries. */
export function selectWordWindow<T extends {id:string}>(pool:T[],source:WordPoolSource,offset=0,limit=6):T[]{
 return pool.slice(source==='due'?0:offset,(source==='due'?0:offset)+limit);
}

export function preparationIds(ids:string[],history:Record<string,SeenAttempt[]>,explicitRestart=false):string[]{
 return explicitRestart?ids:ids.filter(id=>!(history[id]?.length));
}

/** Re-entry after a miss or a helped answer is still prompted by recent exposure. */
export function recentWordHelp(history:SeenAttempt[],mode:SeenAttempt['mode'],now:number):boolean{
 const day=86_400_000;
 return history.some(a=>a.mode===mode&&(!a.correct||a.assisted)&&Date.parse(a.at)<=now&&now-Date.parse(a.at)<day);
}

export function hasRecentWordExposure(wordId:string,mode:SeenAttempt['mode'],exposed:Record<string,number>|undefined,now:number):boolean{
 const at=exposed?.[`${wordId}:${mode}`];
 return at!==undefined&&at<=now&&now-at<86_400_000;
}

export function wordIsAssisted(wordId:string,mode:SeenAttempt['mode'],exposed:Map<string,number>,missedIds:string[],history:SeenAttempt[],now:number,persisted:Record<string,number>={}):boolean{
 const exposure=exposed.get(`${wordId}:${mode}`);
 return (exposure!==undefined&&exposure<=now&&now-exposure<86_400_000)||hasRecentWordExposure(wordId,mode,persisted,now)||missedIds.includes(wordId)||recentWordHelp(history,mode,now);
}
