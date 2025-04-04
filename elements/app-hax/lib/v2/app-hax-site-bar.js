/* eslint-disable no-console */
// dependencies / things imported
import { html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

const DropDownBorder = new URL(
  "../assets/images/DropDownBorder.svg",
  import.meta.url,
);
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteBars extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-bar";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.icon = "link";
    this.opened = false;
    this.inprogress = false;
    this.iconLink = "/";
    this.textInfo = {};
    this.siteId = "";
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      opened: { type: Boolean, reflect: true },
      icon: { type: String },
      inprogress: { type: Boolean, reflect: true },
      iconLink: { type: String, attribute: "icon-link" },
      textInfo: { type: Object },
      siteId: { type: String, reflect: true, attribute: "site-id" },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened" && oldValue !== undefined) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --main-banner-width: 220px;
          --main-banner-height: 220px;
          --band-banner-height: 220px;
          display: block;
          background-color: var(--simple-colors-default-theme-light-blue-3);
          color: var(--simple-colors-default-theme-grey-3);
          outline: 5px solid var(--simple-colors-default-theme-light-blue-4);
          outline-offset: -5px;
          border-radius: 8px;
          box-shadow: var(--ddd-boxShadow-lg);
          position: relative;
        }
        .imageLink img{
            display: block;
            width: 216px;
            height: 125px;
            overflow: clip;
            justify-self: center;
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
          }

        #labels {
          display: block;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        #labels ::slotted(*) {
          font-family: var(--ddd-font-primary);
          font-size: 20px;
          font-weight: bold;
        }
        #labels ::slotted(a) {
          color: var(--simple-colors-default-theme-light-blue-11);
          padding: 8px 0;
          display: block;
        }
        #labels ::slotted(a:focus),
        #labels ::slotted(a:hover) {
          color: var(--simple-colors-default-theme-light-blue-3);
          background-color: var(--simple-colors-default-theme-light-blue-11);
        }

        :host([opened]) {
          background-color: var(--simple-colors-default-theme-light-blue-3);
        }
        #mainCard {
          display: block;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: var(--main-banner-width);
          height: var(--main-banner-height);
          padding: 2px 4px;
        }

        #overlay {
          display: flex;
          position: absolute;
          top: 0;
          left: 0;
          visibility: hidden;
          justify-content: center;
          align-items: center;
          height: 1px;
          width: var(--main-banner-width);
          z-index: 999;
        }
        #closeButton {
          position: absolute;
          top: 10px;
          right: 5px;
          background: var(--simple-colors-default-theme-light-blue-1, var(--simple-colors-default-theme-light-blue-11));
          color: var(--simple-colors-default-theme-light-blue-11, var(--simple-colors-default-theme-light-blue-1));
          border: none;
          font-size: 12px;
          cursor: pointer;
          z-index: 1001;
          border-radius: 100;
        }

        :host([opened]) #overlay {
          height: var(--main-banner-height);
          visibility: visible;
          width: 100%;
          height: 100%;
        }
        a {
          flex: 1;
        }
        #labels {
          display: flex;
          text-align: center;
          justify-content: center;
          flex: 6;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 20px;
        }
        #dots {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          color: var(--simple-colors-default-theme-light-blue-11);
          border: solid var(--simple-colors-default-theme-light-blue-11);
          border-radius: 4px;
          margin-left: 8px;
        }
        @media (max-width: 640px) {
          :host {
            --main-banner-height: 40px;
            --band-banner-height: 140px;
          }
          #icon,
          #dots {
            --simple-icon-width: 30px;
            --simple-icon-height: 30px;
          }
          #mainCard {
            padding: 0;
          }
          
        }
      `,
    ];
  }

  __clickButton() {
    this.opened = !this.opened;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div id="mainCard">
        <div class="imageLink">
          <img src="https://i.pinimg.com/originals/a0/42/8b/a0428b95538d471b344081d7ebede5d9.jpg">
        </div>
        
        <div id="labels">
          <slot name="heading"></slot>
          <simple-icon-button-lite
          icon="more-vert"
          id="dots"
          @click=${this.__clickButton}
        ></simple-icon-button-lite>
        </div>
        
      </div>
      <div id="overlay">
        <button id="closeButton" @click=${this.__clickButton}>✖</button>
        <slot name="band"></slot>
      </div>

      <simple-tooltip for="icon" position="left">Access site</simple-tooltip>
      <simple-tooltip for="dots" position="right">More options</simple-tooltip>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}
customElements.define(AppHaxSiteBars.tag, AppHaxSiteBars);
