import makerjs from "makerjs";
import opentype from "opentype.js";
import * as sbp from "svg-blueprint";

const fonts = {};
const loadFont = fontName => {
  opentype.load(`/fonts/${fontName}.ttf`, (err, font) => {
    if (err) {
      console.error(err);
      return;
    }
    fonts[fontName] = font;
  });
}

loadFont('Mardoto-Bold');
loadFont('Mardoto-Light');
loadFont('Mardoto-Regular');
loadFont('Mardoto-Thin');

const blueprint = new sbp.Blueprint({
  axisColor: "#002082",
  axisOpacity: 0.9,
  backgroundColor: "#ffffff",
  stroke: "#111111",
  gridColor: "#4A6DE5",
  gridOpacity: 0.8,
  parentSelector: "#model",
  width: '100%',
  height: '100%'
});

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

const getValueFromParam = param => {
  if (param.type === "text") {
    return {
      font: fonts[param.font],
      size: param.size,
      text: param.value,
      value: param.value,
    };
  }
  if (param.type === "group") {
    const values = {};
    (param.parameters || []).map((subParam, subParamIndex) => {
      values[subParam.key || getTitleFromParam(subParam) || subParamIndex] = getValueFromParam(subParam);
    });
    return values;
  }

  return param.value;
};

const getTitleFromParam = (param) => {
  return typeof param.title !== "string" ? param.title['en-US'] : param.title;
};

export const generateModel = (Model, downloadableModelName) => {
  const createTimer = () => {
    setTimeout(() => {
      if (Object.keys(fonts).length < 4) {
        createTimer();
      } else  {
        _generateModel(Model, downloadableModelName);
      }
    }, 50);
  };
  createTimer();
}

const _generateModel = (Model, downloadableModelName = '') => {
  const values = (Model.metaParameters || []).map(param => getValueFromParam(param));

  const generate = () => {
    const model = new Model(...values);

    const svg = makerjs.exporter.toSVG(model, {origin: [0, 0]});
    const div = document.createElement("div");
    div.innerHTML = svg;
    const svgGroup = div.querySelector("#svgGroup");
    blueprint.elements.bbox.innerHTML = '';

    [...svgGroup.childNodes].forEach(childNode => {
      childNode.removeAttribute("vector-effect");
      blueprint.elements.bbox.appendChild(childNode);
    });

    blueprint.fit();
  }

  const handleChange = (index, type, value) => {
    values[index] = value;
    if (type === "range") {
      document.getElementById(`param-${index}`).textContent = value;
    }
    generate();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    const model = new Model(...values);
    const content = b64EncodeUnicode(makerjs.exporter.toDXF(model));

    a.href = `data:application/dxf;charset=utf-8;base64,${content}`;
    a.download = `${downloadableModelName} - ${Date.now()}.dxf`;
    a.click();
  };

  const paramsEl = document.getElementById("params");
  paramsEl.innerHTML = '';
  generateParams(Model.metaParameters, paramsEl, handleChange, handleDownload, !!downloadableModelName);
  generate();
};


const generateParams = (params, paramsEl, handleChange, handleDownload, downloadable) => {
  params.forEach((param, index) => {
    const title = getTitleFromParam(param);
    const type = param.type;

    const el = generateByType(index, type, param, handleChange);
    if (type === "group") {
      paramsEl.appendChild(el);
      return;
    }
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const span = document.createElement("span");
    span.id = `${(param.parent || '')}param-${index}`;
    if (type === "range") {
      span.textContent = param.value;
    }

    div1.innerText = title;
    el && div2.appendChild(el);
    el && div2.append(span);
    label.appendChild(div1);
    label.appendChild(div2);
    wrapper.append(label);
    wrapper.className = "wrapper";

    paramsEl.appendChild(wrapper);
  });

  if (downloadable) {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    button.onclick = handleDownload;
    button.textContent = "Download";

    wrapper.append(button);
    wrapper.className = "wrapper";

    paramsEl.appendChild(wrapper);
  }
};

const generateByType = (index, type, params, handleChange) => {
  if (type === "range") {
    return generateRange(index, params, handleChange);
  }
  if (type === "text") {
    return generateText(index, params, handleChange);
  }
  if (type === "bool") {
    return generateBool(index, params, handleChange);
  }
  if (type === "select") {
    return generateSelect(index, params, handleChange);
  }
  if (type === "group") {
    return generateGroup(index, params, handleChange);
  }
  return null;
};

const generateRange = (index, params, handleChange) => {
  const el = document.createElement("input");
  el.type = "range";
  el.min = params.min;
  el.max = params.max;
  el.step = params.step;
  el.value = params.value;
  el.oninput = ev => handleChange(index, params.type, +ev.target.value);
  return el;
};

const generateText = (index, params, handleChange) => {
  const el = document.createElement("input");
  el.type = "input";
  el.value = params.value;
  el.onchange = ev => handleChange(index, params.type, {
    font: fonts[params.font],
    size: params.size,
    text: ev.target.value,
    value: ev.target.value,
  });
  return el;
};

const generateBool = (index, params, handleChange) => {
  const el = document.createElement("input");
  el.type = "checkbox";
  el.checked = params.value;
  el.onchange = ev => handleChange(index, params.type, ev.target.checked);
  return el;
};

const generateSelect = (index, params, handleChange) => {
  const el = document.createElement("select");
  el.onchange = ev => handleChange(index, params.type, ev.target.value);
  params.options.forEach(({value, label}) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = params.value === value;
    el.appendChild(option);
  });
  return el;
};

const generateGroup = (index, params, handleChange) => {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = getTitleFromParam(params);
  fieldset.appendChild(legend);
  fieldset.className = "wrapper";

  const parameters = (params.parameters || []).map(parameter => ({
    ...parameter,
    parent: `${params.parent || index}_`,
  }));

  const values = {};
  parameters.map((param, paramIndex) => {
    values[param.key || getTitleFromParam(param) || paramIndex] = getValueFromParam(param);
  });

  const handleGroupParamsChange = (paramIndex, type, value) => {
    const param = parameters[paramIndex];
    if (type === "range") {
      document.getElementById(`${param.parent}param-${paramIndex}`).textContent = value;
    }
    values[param.key || getTitleFromParam(param) || paramIndex] = value;
    handleChange(index, params.type, values);
  };

  generateParams(parameters, fieldset, handleGroupParamsChange);
  return fieldset;
};
