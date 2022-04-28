const api_recipes="https://api.edamam.com/api/recipes/v2?type=public&";
const api_id_recipes="d683117b";
const api_key="2efd83bc8dd404aac01c8a2b391867e5";

const spotify_url="https://api.spotify.com/v1/browse/new-releases";
const spotify_token='https://accounts.spotify.com/api/token';
client_id="dd29f8370e0d463c9b9f85f2753fc3a8";
client_secret="d697efff6c854e128b796cf46962505c";


function MostraRicerca(event){
    const form=document.querySelector("form");
    form.classList.remove("Hidden");
    form.addEventListener("submit",Ricerca);
    event.currentTarget.addEventListener("click",NascondiRicerca);
    event.currentTarget.removeEventListener("click",MostraRicerca);
}
function NascondiRicerca(event){
    const Ricerca=document.querySelector("form");
    Ricerca.classList.add("Hidden");
    event.currentTarget.removeEventListener("click",NascondiRicerca);
    event.currentTarget.addEventListener("click",MostraRicerca);
}
function OnResponse(response){
 return response.json();
}
function OnJson(json){
    const sezione_ricetta=document.querySelector("#vista_ricetta");
    const titolo_ricetta=document.querySelector("#titolo");
    titolo_ricetta.textContent="Risultati Ricerca";
    sezione_ricetta.classList.add("Hidden");
    const nuova_ricetta=document.querySelector(".nuova_vista");
    nuova_ricetta.innerHTML='';
    nuova_ricetta.classList.remove("Hidden");
    for(let i=0;i<2;i++){
       const hit=json.hits[i];
       const titolo=hit.recipe.label;
       const ingredienti=hit.recipe.ingredients;
       const img=hit.recipe.images.REGULAR.url;

       const contenuto=document.createElement("div");
       contenuto.classList.add("contenuto");
       
       const title=document.createElement("div");
       title.textContent=titolo;
       
       const Box1=document.createElement("div");
       Box1.classList.add("Box1");
       
       const immagine=document.createElement("img");
       immagine.src=img;
       
       const Box2=document.createElement("div");
       Box2.classList.add("Box2");
       
       for(let p=0;p<ingredienti.length;p++){
           Box2.innerHTML=Box2.innerHTML+ingredienti[p].text+"<br/>";
       }
       
       Box1.appendChild(title);
       Box1.appendChild(immagine);
       contenuto.appendChild(Box1);
       contenuto.appendChild(Box2);
       const section=document.createElement("section");
       section.appendChild(contenuto);
       nuova_ricetta.appendChild(section);

       butt=document.querySelector("#Ritorna");
       butt.classList.remove("Hidden");
       butt.addEventListener("click",torna);
    }
}
function torna(event){
    event=event.currentTarget;
    const nuova_ricetta=document.querySelector(".nuova_vista");
    nuova_ricetta.innerHTML='';
    nuova_ricetta.classList.add("Hidden");
    const sezione_ricetta=document.querySelector("#vista_ricetta");
    const titolo_ricetta=document.querySelector("#titolo");
    titolo_ricetta.textContent="Torta al Cioccolato";
    sezione_ricetta.classList.remove("Hidden");
    event.classList.add("Hidden");
    const Vista_Spotify=document.querySelector(".Spotify");
    Vista_Spotify.classList.add("Hidden");
}
function Ricerca(event){
    event.preventDefault();
    const ricetta_input=document.querySelector("#ricetta");
    const ricetta_value=encodeURIComponent(ricetta_input.value);
    rest_url= api_recipes+"q="+ricetta_value+"&app_id="+api_id_recipes+"&app_key="+api_key;
    fetch(rest_url,{
        method:"GET",
        header:"Accept: application/json"
    }).then(OnResponse).then(OnJson);
    
    fetch(spotify_token,{
        method:"post",
        body: 'grant_type=client_credentials',
        headers: { 'Content-Type':'application/x-www-form-urlencoded',
                   'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)}
    }).then(OnResponse).then(OnToken).then(OnSpotifyJson);
}
function OnToken(json){
return json.access_token;
}
function OnSpotifyJson(token){
    fetch(spotify_url,{
        method:"get",
        headers: {"Accept": "application/json",
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token}
    }).then(OnResponse).then(JsonMostraAlbum);
}
function JsonMostraAlbum(json){
    const nuova_ricetta=document.querySelector(".Spotify");
    nuova_ricetta.classList.remove("Hidden");
    const Box1=document.createElement("div");
    Box1.classList.add("Box1");
    Box1.innerHTML="Ti consiglio questo artista raccomandato durante la prepazione <br/>";
    const immagine=document.createElement("img");
          immagine.src=json.albums.items[0].images[1].url;
    const a=document.createElement("a");
          a.href=json.albums.items[0].artists[0].external_urls.spotify;
    a.appendChild(immagine);
    Box1.appendChild(a);
    nuova_ricetta.innerHTML="";
    nuova_ricetta.appendChild(Box1);
}

const Cerca = document.querySelector('a.button');
Cerca.addEventListener("click",MostraRicerca);

const nuova_ricetta=document.querySelector(".nuova_vista");
nuova_ricetta.classList.add("Hidden");
const Vista_Spotify=document.querySelector(".Spotify");
Vista_Spotify.classList.add("Hidden");