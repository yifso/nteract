/**
 * Sets the execution state after a kernel has been launched.
 *
 * @oaram  {ActionObservable}  action$ ActionObservable for LAUNCH_KERNEL_SUCCESSFUL action
 */
export const watchExecutionStateEpic = (
  action$: ActionsObservable<actions.NewKernelAction>
) =>
  action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: actions.NewKernelAction) =>
      action.payload.kernel.channels.pipe(
        filter((msg: JupyterMessage) => msg.header.msg_type === "status"),
        map((msg: JupyterMessage) =>
          actions.setExecutionState({
            kernelStatus: msg.content.execution_state,
            kernelRef: action.payload.kernelRef
          })
        ),
        takeUntil(action$.pipe(ofType(actions.KILL_KERNEL_SUCCESSFUL)))
      )
    )
  );

/**
 * Send a kernel_info_request to the kernel.
 *
 * @param  {Object}  channels  A object containing the kernel channels
 * @returns  {Observable}  The reply from the server
 */
export function acquireKernelInfo(
  channels: Channels,
  kernelRef: KernelRef,
  contentRef: ContentRef
) {
  const message = createMessage("kernel_info_request");

  const obs = channels.pipe(
    childOf(message),
    ofMessageType("kernel_info_reply"),
    first(),
    mergeMap(msg => {
      const c = msg.content;
      const l = c.language_info;

      const info: KernelInfo = {
        protocolVersion: c.protocol_version,
        implementation: c.implementation,
        implementationVersion: c.implementation_version,
        banner: c.banner,
        helpLinks: c.help_links,
        languageName: l.name,
        languageVersion: l.version,
        mimetype: l.mimetype,
        fileExtension: l.file_extension,
        pygmentsLexer: l.pygments_lexer,
        codemirrorMode: l.codemirror_mode,
        nbconvertExporter: l.nbconvert_exporter
      };

      let result;
      if (!c.protocol_version.startsWith("5")) {
        result = [
          actions.launchKernelFailed({
            kernelRef,
            contentRef,
            error: new Error(
              "The kernel that you are attempting to launch does not support the latest version (v5) of the messaging protocol."
            )
          })
        ];
      } else {
        result = [
          // The original action we were using
          actions.setLanguageInfo({
            langInfo: msg.content.language_info,
            kernelRef,
            contentRef
          }),
          actions.setKernelInfo({
            kernelRef,
            info
          })
        ];
      }

      return of(...result);
    })
  );

  return Observable.create((observer: Observer<any>) => {
    const subscription = obs.subscribe(observer);
    channels.next(message);
    return subscription;
  });
}

/**
 * Gets information about newly launched kernel.
 *
 * @param  {ActionObservable}  The action type
 */
export const acquireKernelInfoEpic = (
  action$: ActionsObservable<actions.NewKernelAction>
) =>
  action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: actions.NewKernelAction) => {
      const {
        payload: {
          kernel: { channels },
          kernelRef,
          contentRef
        }
      } = action;
      return acquireKernelInfo(channels, kernelRef, contentRef);
    })
  );
