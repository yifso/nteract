import { IClassicComm } from "@jupyter-widgets/base"
import { Dispatch } from "redux";
import { createCommMessage, createCommOpenMessage } from "@nteract/epics/lib/comm";
import { childOf, ofMessageType } from "@nteract/messaging";
import { Observable } from "rxjs";

export class WidgetComm implements IClassicComm {
    comm_id: string;
    target_name: string;
    target_module: string;
    kernel: any;

    constructor(comm_id: string, target_name:string, target_module: string, kernel: any){
        this.comm_id = comm_id;
        this.target_name = target_name;
        this.target_module = target_module;
        this.kernel = kernel;
    }

    open(data: any, callbacks: any, metadata?: any, buffers?: ArrayBuffer[] | ArrayBufferView[]): string{
        const message = createCommOpenMessage(this.comm_id, this.target_name, this.flattenBufferArrays(buffers), this.target_module);
        //console.log("commopen", message);
        this.kernel.channels.next(message);

        if(callbacks.iopub)
        {
            callbacks.iopub.status({content: {execution_state: "idle"}});
        }
        return "";
    }

    send(data: any, callbacks: any, metadata?: any, buffers?: ArrayBuffer[] | ArrayBufferView[]): string {
        //Create message
        const message = createCommMessage(this.comm_id, data, this.flattenBufferArrays(buffers));
        //Send
        //console.log("sending message", message);
        this.kernel.channels.next(message);
        //Register callbacks
        this.kernel.channels.pipe(
            childOf(message)
        ).subscribe((reply: any) => {
            console.log("reply", reply);
            let callbackFunc = callbacks[reply.channel][reply.header.msg_type];
            if(callbackFunc){
                callbackFunc(reply);
            }
        });
        return message.header.msg_id;
    }

    close(data?: any, callbacks?: any, metadata?: any, buffers?: ArrayBuffer[] | ArrayBufferView[]): string{
        console.log("close");
        return "";
    }

     /**
     * Register a message handler
     * @param  callback, which is given a message
     */
    on_msg(callback: (x: any) => void): void{
        console.log("on_msg");
        this.kernel.channels.pipe(
            ofMessageType("comm_msg"),
            withCommId(this.comm_id)
        ).subscribe((msg:any) => {
            console.log("calling back", msg);
            callback(msg);
        })
    }

    /**
     * Register a handler for when the comm is closed by the backend
     * @param  callback, which is given a message
     */
    on_close(callback: (x: any) => void): void{
        console.log("on_close");
        this.kernel.channels.pipe(
            ofMessageType("comm_close"),
            withCommId(this.comm_id)
        ).subscribe((msg:any) => {
            console.log("calling back", msg);
            callback(msg);
        })
    }

    flattenBufferArrays(buffers?: ArrayBuffer[] | ArrayBufferView[]): Uint8Array | undefined{
        if(buffers === undefined) return undefined;
        let byteLength = 0;
        for(let b of buffers){
            byteLength += b.byteLength;
        }
        let flattened = new Uint8Array(byteLength);
        for(let b of buffers){
            let arr = b instanceof ArrayBuffer ? new Uint8Array(b) : b as Uint8Array;
            flattened.set(arr);
        }
        return flattened;
    }
}

/**
 * operator for getting all messages that declare their parent header as
 * parentMessage's header.
 *
 * @param parentMessage The parent message whose children we should fetch
 *
 * @returns A function that takes an Observable of kernel messages and returns
 * messages that are children of parentMessage.
 */
function withCommId(comm_id: string) {
    return (source: Observable<any>) => {
        return Observable.create((subscriber: any) => source.subscribe(msg => {
            if (msg && msg.content && msg.content.comm_id === comm_id) {
                subscriber.next(msg);
            }
        }, 
        // be sure to handle errors and completions as appropriate and
        // send them along
        err => subscriber.error(err), () => subscriber.complete()));
    };
}