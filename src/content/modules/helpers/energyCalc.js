// we grab the constants from a different file

import {
  MODEL_REGISTRY,
  REGION_REGISTRY,
  PROMPT_TYPE_MULTIPLIER,
  DOMAIN_MULTIPLIER,
  LANGUAGE_MULTIPLIER,
  UI_MULTIPLIER
} from './energyCalcConstants.js';

function contextMultiplier(conversationLength, isFollowup) {
  let m = 1.0;
  if (conversationLength > 5) m += 0.05;
  if (conversationLength > 10) m += 0.10;
  if (isFollowup) m += 0.05;
  return m;
}

function estimateEnergyWh(tokens_in, tokens_out, latency_ms, streaming_duration_ms, model_name, model_mode, prompt_type, domain, language, conversation_length, is_followup, ui_interaction) {
// grab the coeffiecient of the model found
  const coeff =
    MODEL_REGISTRY[`${model_name}|${model_mode}`] ??
    MODEL_REGISTRY[`${model_name}|standard`] ??
    MODEL_REGISTRY['default|standard'];

  if (!coeff) {
    throw new Error(`No model coefficients for ${model_name} / ${model_mode} and no default found`);
  }
  // calculate the number of energy used based on token counts
  const eTokens =
    coeff.energy_per_input_token * tokens_in +
    coeff.energy_per_output_token * tokens_out;

  // caclulate the effective active time in seconds
  const tActiveS = (streaming_duration_ms + coeff.latency_factor * latency_ms) / 1000;
  // then convert it into watt hours (with the 3600) 
  const eTime = (coeff.power_watts * tActiveS) / 3600;
  const eBase = eTokens + eTime;

  
  // here we add up all the multipliers
  // with ??, 1.0 is the default if nothing is found
  const mPrompt = PROMPT_TYPE_MULTIPLIER[prompt_type] ?? 1.0;
  const mDomain = DOMAIN_MULTIPLIER[domain] ?? 1.0;
  const mLanguage = LANGUAGE_MULTIPLIER[language] ?? 1.0;
  const mContext = contextMultiplier(conversation_length, is_followup);

  // calculate all the UI multipliers
  let mUi = 1.0;
  for (const [key, value] of Object.entries(ui_interaction)) {
    if (value) mUi *= UI_MULTIPLIER[key] ?? 1.0;
  }

  // then put it all together
  return eBase * mPrompt * mDomain * mLanguage * mContext * mUi;
}

function estimateCo2Grams(energyWh, region = 'EU') {
  const regionInfo = REGION_REGISTRY[region];
  if (!regionInfo) throw new Error(`No region defaults for ${region}`);
  return (energyWh / 1000) * regionInfo.carbon_g_per_kwh;
}

function estimateWaterLiters(energyWh, region = 'EU') {
  const regionInfo = REGION_REGISTRY[region];
  if (!regionInfo) throw new Error(`No region defaults for ${region}`);
  return (energyWh / 1000) * regionInfo.water_l_per_kwh;
}

export function computeEnvironmentalImpact(tokens_in, tokens_out, latency_ms, streaming_duration_ms, model_name, model_mode, prompt_type, domain, language, conversation_length, is_followup, ui_interaction, region = 'EU') {
  try {
    const energyWh = estimateEnergyWh(tokens_in, tokens_out, latency_ms, streaming_duration_ms, model_name, model_mode, prompt_type, domain, language, conversation_length, is_followup, ui_interaction);
    const co2G = estimateCo2Grams(energyWh, region);
    const waterL = estimateWaterLiters(energyWh, region);
    return [energyWh, co2G, waterL];
    // this catches the error raised by a missing model
  } catch (e) {
    const { model_name, model_mode } = event?.model ?? {};
    console.warn(`[EnergyCalc] WARNING: falling back to zeros for ${model_name}/${model_mode}:`, e);
    return [0, 0, 0];
  }
}