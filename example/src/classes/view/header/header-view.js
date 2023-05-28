import './header.css';
import View from '../view';
import IndexView from '../index/index-view';
import ProductView from '../product/product-view';
import AboutView from '../about/about-view';
import ElementCreator from '../../util/element-creator';

const CssClasses = {
    HEADER: 'header',
    NAV: 'nav',
    ITEM: 'nav-item',
    ITEM_SELECTED: 'nav-item__selected',
};
const NamePages = {
    INDEX: 'Главная',
    SHOWCASE: 'Карточки',
    ABOUT: 'О нас',
};
const START_PAGE_INDEX = 0;

/**
 * @typedef {{ name: string, callback: function }} Page
 */

export default class HeaderView extends View {
    /**
     * @param {import('../main/main-view').default} mainComponent
     */
    constructor(mainComponent) {
        /**
         * @type {import('../view').ViewParams}
         */
        const params = {
            tag: 'header',
            classNames: [CssClasses.HEADER],
        };
        super(params);
        this.headerLinkElements = [];
        this.configureView(mainComponent);
    }

    /**
     * @param {import('../main/main-view').default} mainComponent
     */
    configureView(mainComponent) {
        /**
         * @type {import('../../util/element-creator').ElementParams}
         */
        const navParams = {
            tag: 'nav',
            classNames: [CssClasses.NAV],
            textContent: '',
            callback: null,
            attr: null,
        };
        const creatorNav = new ElementCreator(navParams);
        this.viewElementCreator.addInnerElement(creatorNav);

        const indexView = new IndexView();
        const productView = new ProductView();
        const aboutView = new AboutView();

        const pages = [
            {
                name: NamePages.INDEX,
                callback: () => mainComponent.setContent(indexView),
            },
            {
                name: NamePages.SHOWCASE,
                callback: () => mainComponent.setContent(productView),
            },
            {
                name: NamePages.ABOUT,
                callback: () => mainComponent.setContent(aboutView),
            },
        ];
        pages.forEach((page, index) => {
            const linkElement = this.createLinkElement(page.name, page.callback);
            linkElement.addEventListener('click', this.linkClickHandler.bind(this));

            creatorNav.addInnerElement(linkElement);
            if (index === START_PAGE_INDEX) {
                page.callback();
                linkElement.classList.add(CssClasses.ITEM_SELECTED);
            }

            this.headerLinkElements.push(linkElement);
        });

        this.viewElementCreator.addInnerElement(creatorNav);
    }

    /**
     * @param {MouseEvent} event
     */
    linkClickHandler(event) {
        this.headerLinkElements.forEach((element) => element.classList.remove(CssClasses.ITEM_SELECTED));
        if (event.target instanceof HTMLElement) {
            event.target.classList.add(CssClasses.ITEM_SELECTED);
        }
    }

    /**
     * @param {string} text
     * @param {function} clickCallback
     * @returns {HTMLElement}
     */
    createLinkElement(text, clickCallback) {
        /**
         * @type {import('../../util/element-creator').ElementParams}
         */
        const linkParams = {
            tag: 'a',
            classNames: [CssClasses.ITEM],
            textContent: text,
            callback: clickCallback,
            attr: null,
        };
        const creatorNav = new ElementCreator(linkParams);

        return creatorNav.getElement();
    }
}
