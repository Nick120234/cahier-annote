// Connexion Firebase (Google) + stockage Firestore — Mon cahier annoté
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {initializeAuth,indexedDBLocalPersistence,browserLocalPersistence,browserPopupRedirectResolver,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {initializeFirestore,persistentLocalCache,persistentMultipleTabManager,memoryLocalCache,doc,getDoc,setDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg=window.FIREBASE_CONFIG;
if(!cfg||!cfg.apiKey||/COLLER/.test(cfg.apiKey)){window.appNoConfig&&window.appNoConfig();}
else{
  const app=initializeApp(cfg);
  // Session conservée sur l'appareil (IndexedDB, puis localStorage en secours) : pas de reconnexion à chaque ouverture
  const auth=initializeAuth(app,{persistence:[indexedDBLocalPersistence,browserLocalPersistence],popupRedirectResolver:browserPopupRedirectResolver});
  let db;
  try{db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})})}
  catch(e){db=initializeFirestore(app,{localCache:memoryLocalCache()})}
  const provider=new GoogleAuthProvider();
  window.fbLogin=async()=>{
    try{await signInWithPopup(auth,provider)}
    catch(e){if(e&&(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment"))await signInWithRedirect(auth,provider);else throw e}
  };
  window.fbLogout=()=>signOut(auth);
  getRedirectResult(auth).catch(()=>{});
  onAuthStateChanged(auth,u=>{
    if(!u){window.onFirebaseLogout&&window.onFirebaseLogout();return}
    const ref=(c,k)=>doc(db,"cahier",u.uid,c,k);
    window.onFirebaseUser({
      uid:u.uid,name:u.displayName||"",email:u.email||"",
      kv:{doc:k=>({
        get:async()=>{const s=await getDoc(ref("kv",k));return s.exists()?s.data():null},
        set:v=>setDoc(ref("kv",k),v),
        delete:()=>deleteDoc(ref("kv",k))})},
      blobs:{
        put:(id,d)=>setDoc(ref("blobs",id),{d,t:Date.now()}),
        get:async id=>{const s=await getDoc(ref("blobs",id));return s.exists()?s.data().d:null},
        del:id=>deleteDoc(ref("blobs",id))}
    });
  });
}
