import { Subject } from "rxjs";
import { WidgetComm } from "../../src/manager/widget-comms";

describe("WidgetComm", () => {
  it("cam be instantied", () => {
    const comm_id = "aCommId";
    const target_name = "target_name";
    const target_module = "target_module";
    const kernel = { channels: new Subject() };
    const comm = new WidgetComm(comm_id, target_name, target_module, kernel);
    expect(comm.comm_id).toEqual(comm_id);
    expect(comm.target_name).toEqual(target_name);
    expect(comm.target_module).toEqual(target_module);
    expect(comm.kernel).toEqual(kernel);
  });
  it("can send a comm_open message", () => {
    const comm_id = "aCommId";
    const target_name = "target_name";
    const target_module = "target_module";
    const kernel = {
      channels: {
        next: jest.fn(),
        pipe: jest.fn(() => ({ subscribe: jest.fn() }))
      }
    };
    const comm = new WidgetComm(comm_id, target_name, target_module, kernel);
    comm.open({ target_name: "target_name" }, {});
    expect(kernel.channels.next).toBeCalled();
    expect(kernel.channels.pipe).toBeCalled();
  });
  it("can process close messages", () => {
    const comm_id = "aCommId";
    const target_name = "target_name";
    const target_module = "target_module";
    const kernel = {
      channels: {
        next: jest.fn(),
        pipe: jest.fn(() => ({ subscribe: jest.fn() }))
      }
    };
    const comm = new WidgetComm(comm_id, target_name, target_module, kernel);
  });
});
