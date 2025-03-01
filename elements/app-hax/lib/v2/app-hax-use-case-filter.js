/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-use-case.js";

export class AppHaxUseCaseFilter extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-use-case-filter";
  }

  constructor() {
    super();
    this.searchTerm = "";
    this.disabled = false;
    this.showSearch = false;
    this.items = [];
    this.filteredItems = [];
    this.activeFilters = [];
    this.filters = [];
    this.searchQuery = "";
    this.demoLink = "";
    this.errorMessage = "";
    this.loading = false;
  }

  // Site.json is coming from
  
  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      filteredItems: { type: Array },
      activeFilters: { type: Array },
      filters: { type: Array },
      searchQuery: { type: String },
      demoLink: { type: String},
      errorMessage: { type: String },
      loading: { type: Boolean }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
          display: block;
          width: 100%;
        }
        .results {
          display: flex;
          margin-left: 360px;
          justify-content: flex-start;
          align-items: flex-start;
        }
        .reset-button {
          width: 50px;
          height: 24px;
          margin: 8px;
        }
        input [type="text"]{
          opacity: 1;
          width: 200px;
          max-width: 25vw;
          transition: all ease-in-out 0.3s;
          padding: 4px;
          font-family: "Press Start 2P", sans-serif;
          font-size: 12px;
          margin: 2px 0 0 16px;
        }
        .upper-filter {
          display: flex;
        }
        .filter {
          position: fixed;
          top: 225px;
          left: 20px;
          height: 300px;
          justify-self: flex-start;
          display:flex;
          background-color: white;
          flex-direction: column;
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          background-color: var(--ddd-theme-default-white);
          border: solid var(--ddd-theme-default-limestoneGray) 1px;
          border-radius: var(--ddd-radius-xs);
          width: 300px;
        }
        .filterButtons {
          text-align: left;
          align-items: flex-start;
          justify-self: flex-start;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          width: 150px;
        }
        .filterButtons label {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 8px;
        }
        input[type="checkbox"] {
          width: 30px;
        }
      `,
    ];
  }
  testKeydown(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      this.toggleSearch();
    }
  }
  // eslint-disable-next-line class-methods-use-this
  search() {
    store.appEl.playSound("click");
    this.searchTerm = this.shadowRoot.querySelector("#searchField").value;
  }

  render() {
    return html`
    <div class="filter">
  <!--search bar-->
    <div class="upper-filter">
      <input
        icon="icons:search"
        icon-position="left"
        id="searchField"
        @click="${this.toggleSearch}"
        @input="${this.handleSearch}"
        @keydown="${this.testKeydown}"
        type="text"
        placeholder="Search Templates"
      />
      
      <button class="reset-button" @click="${this.resetFilters}">Reset</button>
    </div>
      
      <div class="filterButtons">
      ${this.filters.map(
          (filter) => html`
            <label>
              <input
                type="checkbox"
                .value=${filter}
                .checked=${this.activeFilters.includes(filter)}
                @change=${(e) => this.toggleFilter(e)}
              />
              ${filter}
            </label>
          `
        )}
      </div>
    </div>

    <div class="results">
      ${this.filteredItems.length > 0
        ? this.filteredItems.map(
        (item, index) => html`
          <div>
            <a href="${item.demoLink}" target="_blank"
            class="${index === this.activeUseCase ? "active-card" : ""}"></a>
            <app-hax-use-case
              .source=${item.useCaseImage || ""}
              .title=${item.useCaseTitle || ""}
              .description=${item.useCaseDescription || ""}
              .demoLink=${item.demoLink || ""}
              .iconImage=${item.useCaseIcon || []}
            ></app-hax-use-case>
            </a>
          </div>
        `
        )
        : html`<p>No templates match the filters specified.</p>`}
    </div>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.updateResults();
  }

  updated(changedProperties) {
    if (
      changedProperties.has("searchQuery") ||
      changedProperties.has("activeFilters") ||
      changedProperties.has("item")
    ) {
      this.applyFilters();
    }
  }


  toggleSearch() {
    if (!this.disabled) {
      this.shadowRoot.querySelector("#searchField").value = "";
      store.appEl.playSound("click");
      this.showSearch = !this.showSearch;
      setTimeout(() => {
        this.shadowRoot.querySelector("#searchField").focus();
      }, 300);
    }
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }
  
  toggleFilter(event) {
    const filterValue = event.target.value;

    if (this.activeFilters.includes(filterValue)) {
      this.activeFilters = this.activeFilters.filter((f) => f !== filterValue);
    } else {
      this.activeFilters = [...this.activeFilters, filterValue];
    }
    this.applyFilters();
  }

  applyFilters() {
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    
    console.log("Active Filters:", this.activeFilters);

    this.filteredItems = this.items.filter((item) => {
      const matchesSearch = item.useCaseTitle.toLowerCase().includes(lowerCaseQuery);
    
      const matchesFilters = this.activeFilters.length === 0 || 
      this.activeFilters.some(filter => 
        item.useCaseTag.includes(filter));
    
      return matchesSearch && matchesFilters;
    }); 
    this.requestUpdate();
  }
    
    
  resetFilters() {
    this.searchQuery = "";
    this.activeFilters = []; // Clear active filters
    this.filteredItems = this.items; // Reset to show all items
    this.requestUpdate(); // Trigger an update
  
    // Uncheck checkboxes
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.filterButtons input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false)); 
  
    // Clear search bar
    const searchInput = this.shadowRoot.querySelector('#searchField');
    if (searchInput) {
      searchInput.value = "";
    }
  }

  updateResults() {
    this.loading = true;
    this.errorMessage = ""; // Reset error before fetching
    
    fetch(new URL('./app-hax-recipes.json', import.meta.url).href)  
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON data
    })
    .then(data => {
    // Map JSON data to component's items
          
      if (Array.isArray(data.item)) {
        this.items = data.item.map(item => ({
          useCaseTitle: item.title,
          useCaseImage: item.image,
          useCaseDescription: item.description,
          useCaseIcon: item.attributes.map(attributes => ({
            icon: attributes.icon,
            tooltip: attributes.tooltip
          })),
          useCaseTag: Array.isArray(item.category) ? item.category : [item.category],
          demoLink: item["demo-url"],
        }));
        this.filteredItems = this.items;
        this.filters = [];
    
        data.item.forEach(item => {
          if (Array.isArray(item.category)) {
            item.category.forEach(category => {
              if (!this.filters.includes(category)) {
                this.filters = [...this.filters, category];
              }
            });
          }
        });
      } else {
        this.errorMessage = 'No Templates Found';
      }
      console.log(data);
    })
    .catch(error => {
      this.errorMessage = `Failed to load data: ${error.message}`;
      this.items = [];
      this.filteredItems = [];
    })
    .finally(() => {
      this.loading = false;
      this.requestUpdate();
    });
  }
}
customElements.define("app-hax-use-case-filter", AppHaxUseCaseFilter);
