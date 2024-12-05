declare function startTimedTasks(SERVER_HOSTNAME: string, SERVER_PORT: number): void;
declare function checkIP(SERVER_HOSTNAME: string): void;
declare const _default: {
    start: typeof startTimedTasks;
    checkIP: typeof checkIP;
};
export default _default;
