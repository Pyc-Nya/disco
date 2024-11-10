export {};

declare global {
  interface Window {
    electron: {
      send: (channel: string, data: any) => void;
      invoke: (channel: string) => Promise<any>;
    };
  }
}
