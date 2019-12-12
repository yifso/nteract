const NTERACT_LOGO_URL =
  "https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/svg/nteract_logo_wide_purple_inverted.svg";

export default class BinderHeader extends React.PureComponent {
  render() {
    return (
      <header>
        <div className="left">
          <img
            src={NTERACT_LOGO_URL}
            alt="nteract logo"
            className="nteract-logo"
          />

          <button
            onClick={this.handleSourceSubmit}
            className="play"
            disabled={!currentKernel}
            title={`run cell (${platform === "macOS" ? "⌘-" : "Ctrl-"}⏎)`}
          >
            ▶ Run
          </button>
          <button onClick={() => setShowPanel(!showPanel)}>
            {showPanel ? "Hide" : "Show"} logs
          </button>
        </div>
        {currentServer && currentKernel ? (
          <KernelUI
            status={currentKernel.status}
            kernelspecs={
              currentServer.kernelSpecs &&
              currentServer.kernelSpecs.kernelSpecByKernelName
                ? currentServer.kernelSpecs.kernelSpecByKernelName
                : {}
            }
            currentKernel={currentKernelName}
            onChange={this.handleKernelChange}
          />
        ) : null}
      </header>
    );
  }
}
