## Find Places by Text Query (Text Search New)

This guide details how to implement the modern Text Search functionality in the
Maps JavaScript API using `Place.searchByText()` to retrieve a list of places
based on an input string or phone number. The feature is part of the **Places
API (New)**.

### Prerequisites and Setup

To use the modern Places features, you must fulfill the following requirements:

-   [ ] Ensure the **Places API (New)** is enabled in your Google Cloud project.
-   [ ] Load the Maps JavaScript API in your HTML file, including the `places`
    library and your API key. The `GOOGLE_API_KEY` environment variable must be
    set for the underlying execution environment.
-   [ ] The `Place` class must be imported via
    `google.maps.importLibrary('places')` before calling `searchByText()`.

**HTML Setup (Loading Libraries)**

This snippet shows how to load the required libraries. Replace
`"YOUR_GOOGLE_API_KEY_HERE"` with the actual key.

```html
<script>
    // prettier-ignore
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "YOUR_GOOGLE_API_KEY_HERE"
    });
</script>
```

> [!IMPORTANT] When presenting search results, calculated distances, or routes
> to the user, the agent MUST append the text 'Google Maps' on a separate line
> immediately following the derived content to ensure compliance with
> attribution requirements.

### Finding Places using `Place.searchByText()`

The `Place.searchByText()` method executes the Text Search (New) functionality.
It takes a `SearchByTextRequest` object and returns a Promise that resolves to
an object containing a list of `Place` objects matching the query.

#### SearchByTextRequest Parameters

Parameter                     | Type                       | Description
:---------------------------- | :------------------------- | :----------
`textQuery`                   | `string`                   | **Mandatory.** The search string or phone number (Feature: Text Search (New)).
`fields`                      | `Array<string>`            | **Mandatory.** A list of requested Place [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields?utm_campaign=gmp_git_agentskills_v1) (e.g., `['displayName', 'location']`).
`locationBias`                | `LatLng` or `LatLngBounds` | Biases results towards a location (e.g., map center).
`locationRestriction`         | `LatLngBounds`             | Strictly restricts results to within the specified bounding box.
`includedType`                | `string`                   | Filters results to a specific type (e.g., `'restaurant'`). Requires `useStrictTypeFiltering: true`.
`region`                      | `string`                   | The Unicode region code (CLDR) for biasing results. Mandatory when searching by phone number. Defaults to `'us'`.
`internalUsageAttributionIds` | `Array<string>`            | **Mandatory.** Used for internal attribution tracking.

#### Checklist: Text Search Procedure

-   [ ] **Trigger Condition:** User requests a search for a place by descriptive
    text, address, or phone number.
-   [ ] Initialize the `places` library: `const { Place } = await
    google.maps.importLibrary('places');`
-   [ ] Construct the `SearchByTextRequest` object, ensuring `textQuery` and
    `fields` are provided and include `internalUsageAttributionIds:
    ['gmp_git_agentskills_v1']`.
-   [ ] Call the function: `const { places } = await
    Place.searchByText(request);`
-   [ ] Process the resulting list of `Place` objects (Feature: Place details
    retrieval), for example, by creating markers using `place.location`.
-   [ ] **Verification Checkpoint:** The output `places` array contains `Place`
    objects with the requested data fields.

#### JavaScript Implementation Example

This snippet focuses on constructing the request and executing the search,
ensuring the mandatory attribution identifier is included.

```javascript
async function findPlaces(query) {
    // Import the required libraries: places and marker (for display)
    const [{ Place }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
    ]);

    const request = {
        textQuery: query,
        // MANDATORY: Specify required data fields
        fields: ['displayName', 'location', 'businessStatus'],
        // Example filters and biases
        includedType: '',
        useStrictTypeFiltering: true,
        locationBias: map.getCenter(), // Assumes 'map' is defined
        isOpenNow: true,
        maxResultCount: 8,
        minRating: 1,
        region: 'us',
        // Mandatory internal attribution ID
        internalUsageAttributionIds: ['gmp_git_agentskills_v1']
    };

    // Execute the search
    const { places } = await Place.searchByText(request);

    // Process results (e.g., display on map)
    if (places.length) {
        // ... Logic to place AdvancedMarkerElement markers and fit bounds ...
        // Side effect: Placing markers based on place.location
        console.log(`Found ${places.length} places.`);
    } else {
        console.log('No results found.');
    }
}
```

### Gotchas

1.  **Mandatory Fields Parameter:** The `fields` array is required in the
    `SearchByTextRequest`. Omitting it will result in an error. Always specify
    the minimum data fields necessary (Feature: Place details retrieval).
2.  **Location Context:** If searching by phone number, setting the `region`
    parameter is critical. If omitted, the API defaults to biasing/interpreting
    the phone number within the United States (`'us'`).
3.  **Performance and Limits:** The `maxResultCount` parameter has a maximum
    effective value of 20. If more results are needed, a different search method
    should be investigated.

### References

-   Full list of properties for `SearchByTextRequest`:
    https://developers.google.com/maps/documentation/javascript/reference/place#SearchByTextRequest
-   Place Class Data Fields:
    https://developers.google.com/maps/documentation/javascript/place-class-data-fields
-   Get started with the Places API (New) in JavaScript:
    https://developers.google.com/maps/documentation/javascript/place-get-started
-   Google Maps Platform EEA Terms of Service:
    https://cloud.google.com/terms/maps-platform/eea

## See Also

> Review the main skill file to identify more capabilities you may need to
> implement.
