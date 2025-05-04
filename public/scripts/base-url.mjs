function getBaseUrl() {
    const windowLocation = window.location.hostname;
    console.log(windowLocation);
    let baseUrl;
    if (windowLocation === "localhost"){
        baseUrl = "http://localhost:3000";
    }
    else{
        baseUrl = "http://freelancerio-azure-app-dugshua8d0fqaafg.southafricanorth-01.azurewebsites.net"
    }
    return baseUrl;
}

export default getBaseUrl;