// ═════════════════════════════════════════════════════════════════════════
// Cognigy Code node — "Load member context"
// Place at the VERY TOP of the flow (before the "Once" node) so it runs on
// every input.
//
// The website (index.html → buildCognigyContext) sends the member data over
// SIP INFO as soon as the call is accepted:
//   session.sendInfo("", { veloContext: { username, pointBalance, prizeList, waysOfwinning } })
// Voice Gateway delivers that as a separate, text-less input with the JSON
// in input.data.
// ═════════════════════════════════════════════════════════════════════════

// TEMP: uncomment for the first test call to confirm where the payload lands
// api.log("info", "VELO input.data: " + JSON.stringify(input.data));

const d = input.data || {};
const velo = d.veloContext
  || (d.data && d.data.veloContext)
  || (d.payload && d.payload.veloContext);

if (velo) {
  context.username      = velo.username;
  context.pointBalance  = String(velo.pointBalance);
  context.prizeList     = velo.prizeList;
  context.waysOfwinning = velo.waysOfwinning;
  context.memberDataReceived = true;
}

// true only for the data-only message from the website (no spoken text);
// the If node below uses it so this input does not go through NLU / replies
context.isContextUpdate = !!velo && !input.text;

// Voice Gateway sends this when the caller stays silent past the no-input
// timeout (Set Session Config). Without handling it, Vee treats it as a new
// turn and repeats its last question.
context.isNoInput = d.event === "USER_INPUT_TIMEOUT";
