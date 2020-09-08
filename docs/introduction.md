---
title: "Introduction"
---

# LandingPage secureCodeBox

This repository sources the [securecodebox.io] website. Our webpage is meant to provide an extensive documentation about our [secureCodeBox] and many helpful guides on how to start and operate it. The website is build with the [GatsbyJS] Framework and hosted through [GitHub Pages]. All important decision about this website are documented in our `/adr` folder. If you want to contribute to our website, please follow the Style Guide down below.

## Build and Run

In order to build and run this website you need to install [Node.js and NPM] for your platform.  
Finally you download/clone this repository and install all required Node modules:

```bash
git clone https://github.com/secureCodeBox/securecodebox.github.io.git
cd securecodebox.github.io
npm install
```

Done! :) Now you can start developing and contributing.

For development:

```bash
npm run develop
```

For production locally:

```bash
npm run build
npm run serve
```

And then visit [this](http://localhost:8000/) in your browser.

## Style Guide

The overall design-idea is a clean and professional look. And since securecodebox.io serves mostly an informational purpose, it should stay more simplistic than extraordinary, meaning include only information and elements which either are necessary or helpful and very few basic elements for a good look (e.g. fitting background picture). The development started off from this template theme: [gatsbyserif](https://gatsby-serif.netlify.com/).

### Colors

The color scheme is aimed to be basically white with a soft blue coloring as the main color and gentle highlighting. This website should not be monochrome or monotonous, so feel free to include colored elements and icons but use different colors only ever so slightly and avoid strong contrasts.

Included colors:

```
$white: #ffffff;
$black: #000000;
$primary: #1c3ed3; // Strong blue tone
$iteragenta: #a9218e; // iteratec's main color (avoid using it ;) )
$highlight: #7c00ce57; // Gentle, half transparent violet-ish for highlighting
$secureCodeBlue: #3296dc; // Main, soft blue tone
$secondary: #414156; // Grey, used for non-header text
```

If new colors will be used standardized, make sure to include them as a variable and list it here with it's purpose.

### Fonts

Fonts should be simple and readable. Nothing fancy or special and not be web loaded.

Used Fonts:

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
  'Segoe UI Symbol';
```

### Icons & Images

Icons should be license free and as close to the other icons' style as possible. They should be outlined and monochrome. Color should only be used to fill, never as line color, and only if color does provide a more pleasing look than monochrome. Images should be fitting and mainly used as background (partially). They should fit the color scheme if possible or do **not** stand out through a high contrast to the website. Recommended websites for free icons or images:

- [iconmonstr](https://iconmonstr.com/)
- [pixabay](https://pixabay.com/)

## Documentation Guide

Since we work with various different tools, it is even more important to keep a clean and well structured Documentation. Our website's purpose is to provide a comfortable navigation and clear overview. But since no one is going to update the documentation if it's untraceable, it is also very important to keep the documentation's location clear and as less spread as possible throughout our project. So no single-page documentation hidden in the deep structure of a remote repository! In general it is much easier and simpler to keep most of the documentation in this repository, but the scanner documentation due to our project structure. One key feature our documentations share in order to be put on the website is a frontmatter in each documentation. It is mandatory since at least a title and path are required. But it also can provide helpful other information very easily, for a documentation see [frontmatter]. Don't be afraid to use it for including important information, which you can't get/provide otherwise very well, but don't overuse it! For more detailed examples see the following sections.

### Adding a scanner or persistence provider

Scanners and persistence providers are referred to as integrations. Scanners, which are integrated into our [secureCodeBox-v2-alpha](https://github.com/secureCodeBox/secureCodeBox-v2-alpha) repository have their own directories (located at [/scanners/](https://github.com/secureCodeBox/secureCodeBox-v2-alpha/tree/master/scanners)) in which the main documentation must be written in a `README.md` file. Persistence provider documentation is located at `/src/pages/integrations/persistence-provider/`.

#### Scanner

To add a scanner documentation you need to extend the `scannerRepos` Array in the `gatsby-config.js` file with:

```bash
  {
    name: 'scanner name',
    directory: 'directoryName' # in /scanners/
  }
```

Additionally you can and (for the sake of aesthetics) should provide an icon in `.svg` format (the fancy icons you see on the "Integrations" page), located at `/src/static/integrationIcons`. Simply name it according to the title in the frontmatter, e.g. if the scanner's title is "Arachni" your filename is "Arachni.svg", it's as simple as that. Each of our scanner has a release svg, which needs to be put in the frontmatter of the respective documentation. Our scanner are structured uniformly with a frontmatter of mandatory fields as follows ("Scame" represents the scanner name):

<details>
<summary>Scanner documentation structure</summary>
<br/>
<pre>

        ---

        title: "Scame"

        ---

        ![Scame Logo](url to scanner logo) //not required but nice to have

        A brief description about this scanner.

        <!-- end -->

        # About

        This repository contains a self contained µService utilizing the Scame scanner for the secureCodeBox project. To learn more about the Scame scanner itself visit [reference the scanner].

        ## Scame parameters

        To hand over supported parameters through api usage, you can set following attributes:

        ```
        [
          {
            specify parameter and how to configure the scanner
          }
        ]
        ```

        ## Example
        Provide a simple scan example which everyone can simply reconstruct. Give a Example input/configuration and the according output.

        ## Development

        ### Configuration Options

        To configure this service specify the following environment variables:

        | Environment Variable       | Value Example |
        | -------------------------- | ------------- |
        | ENGINE_ADDRESS             | http://engine |
        | ENGINE_BASIC_AUTH_USER     | username      |
        | ENGINE_BASIC_AUTH_PASSWORD | 123456        |

        ### Local setup

        How to set up the scanner locally.

        ### Test

        How to run the test.

        ### Build with docker

        How to build the docker container.


        >Travis build status
        >License
        >GitHub latest release of our Scame repository

        [reference the scanner]: url

</pre>
</details>

You can add and extend categories as you will, but keep the main structure and if one section would be empty, write an explanation why, if it's not obvious. See this as a adjustable template and have a look at what is written in the other scanner's docs.

#### Persistence provider

To add a persistence provider documentation simply add the markdown file to the folder mentioned above. To provide an icon do as explained before for the scanner. Our persistence provider are structured uniformly with a frontmatter of mandatory fields as follows ("Perprame" represents the persistence provider name):

<details>
<summary>Persistence provider documentation structure</summary>
<br/>
<pre>

        ---

        title: "Perprame"
        path: "persistence-provider/Perprame"
        category: "persistence provider"

        ---

        ## About

        A brief description of this persistence provider with reference: [Perprame].

        ## Configuration

        ### Setting the Persistence Provider

        The engine supports multiple different persistence providers. Each of the prepackaged persistence providers can be toggled on by using environment variables.

        The currently available persistence providers are:

        | Name          | Environment Variable                              | Default Value |
        | ------------- | ------------------------------------------------- | ------------- |
        | Perprame      | `SECURECODEBOX_PERSISTENCE_PERPRAME_ENABLED`      | `"false"`     |
        | Elasticsearch | `SECURECODEBOX_PERSISTENCE_ELASTICSEARCH_ENABLED` | `"false"`     |
        | DefectDojo    | `SECURECODEBOX_PERSISTENCE_DEFECTDOJO_ENABLED`    | `"false"`     |
        | S3            | `SECURECODEBOX_PERSISTENCE_S3_ENABLED`            | `"false"`     |
        | None          | `SECURECODEBOX_PERSISTENCE_NONE_ENABLED`          | `"false"`     |

        To activate the persistence providers the `enabled` variable must be set to `"true"`.

        > **Note**: Most PersistenceProviders require additional configuration to set the location and access credentials. These are documented in the sections for the individual persistence providers below.

        The corresponding PersistenceProvider-implementation class must have a matching `@ConditionalOnProperty` annotation, e.g. `@ConditionalOnProperty(name = "securecodebox.persistence.perprame.enabled", havingValue = "true")` for Perprame.

        ## Specific Settings

        #### Enabling Perprame as Persistence Provider

        To use Perprame for persistence set `securecodebox.persistence.perprame.enabled` or the corresponding environment variable to `"true"`.

        #### Properties / Environment Variables

        | Property | Example Value | Mandatory |
        | -------- | ------------- | --------- |
        |          |               |           |


        [Perprame]: reference url

</pre>
</details>

### Adding tutorials or developer docs

Currently under development, please provide an explanation to why these are split and how this differentiation is meant.

#### Tutorials

Currently under development, this will be the guide for our "Get Started" tutorials similar to the ones above.

#### Developer docs

Currently under development, this will be the guide for our "Docs" developer documentation similar to the ones above.  

## Production Deployment

All changes pushed to the `gh-source` branch get automatically build by GitHub Actions.
The artifacts of the build, aka. the build site, gets forced pushed to the master branch.
The master branch then gets automatically deployed as a GitHub Page.

[securecodebox.io]: https://securecodebox.github.io
[securecodebox]: https://github.com/secureCodeBox/secureCodeBox
[gatsbyjs]: https://www.gatsbyjs.org/
[github pages]: https://pages.github.com/
[node.js and npm]: https://nodejs.org/en/download/
[frontmatter]: https://www.gatsbyjs.org/docs/adding-markdown-pages/#frontmatter-for-metadata-in-markdown-files
