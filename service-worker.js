if(!self.define){let e,s={};const a=(a,r)=>(a=new URL(a+".js",r).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(r,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const u=e=>a(e,i),n={module:{uri:i},exports:c,require:u};s[i]=Promise.all(r.map((e=>n[e]||u(e)))).then((e=>(t(...e),c)))}}define(["./workbox-afb8f5db"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:".gitkeep",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"CNAME",revision:"96ae1fbd4f6c11e06a850065cad5eb2c"},{url:"assets/fonts/Hubot-Sans-LICENSE.txt",revision:"74f238d4ca6deacfe909e83771168325"},{url:"assets/fonts/Hubot-Sans.ttf",revision:"ca9a39292acc2815f8678c3f4c1f82a5"},{url:"assets/fonts/Hubot-Sans.woff",revision:"37d1f706e5e4700e7026b26d026bdf30"},{url:"assets/fonts/Hubot-Sans.woff2",revision:"c5813b25706da3f05841a4e756c7a4bd"},{url:"assets/fonts/Mona-Sans-LICENSE.txt",revision:"8d4d638a836438f6efdd5f37d3f60870"},{url:"assets/fonts/Mona-Sans.ttf",revision:"851446c8c41741113607028ad4662366"},{url:"assets/fonts/Mona-Sans.woff",revision:"f643598eae5a5e376faecd7eb2c3206b"},{url:"assets/fonts/Mona-Sans.woff2",revision:"64d781dba84a902256fa2dd72309ddda"},{url:"assets/fonts/space_grotesk/SpaceGrotesk-Bold.ttf",revision:"a17e24dc3fccc03e32a6e66100fb05df"},{url:"assets/fonts/space_grotesk/SpaceGrotesk-Light.ttf",revision:"021142e7734a57a1a48ca495158863cf"},{url:"assets/fonts/space_grotesk/SpaceGrotesk-Medium.ttf",revision:"705b51b5e52edb8d669adf36eac8f771"},{url:"assets/fonts/space_grotesk/SpaceGrotesk-Regular.ttf",revision:"7f510d38d1c785c851d73882c0ca58c0"},{url:"assets/fonts/space_grotesk/SpaceGrotesk-SemiBold.ttf",revision:"73a35ae608e5c13b794c5f893b67bf61"},{url:"assets/icons/Apple-152.png",revision:"a1c0549cb37c0b7c9e9a892a85de640c"},{url:"assets/icons/Apple-167.png",revision:"349824a8064eeff1373ad07eaed3ab05"},{url:"assets/icons/Apple-180.png",revision:"8368597748f38932647f2f3a4c7dc23f"},{url:"assets/icons/Apple-192.png",revision:"7e7c2992f3314a296456b1b0adae75b8"},{url:"assets/icons/Apple-512.png",revision:"6869545e45a9de3c7290e4f6add2226e"},{url:"assets/icons/Masked-192.png",revision:"7e7c2992f3314a296456b1b0adae75b8"},{url:"assets/icons/Masked-512.png",revision:"6869545e45a9de3c7290e4f6add2226e"},{url:"assets/icons/Solar3_Icon.png",revision:"cb9e0318ab153d40ef232988885d45e2"},{url:"assets/icons/Standard-16.png",revision:"8bb77d08af4f49726aba8430923d4b09"},{url:"assets/icons/Standard-32.png",revision:"0e349cb9000532d4698471bd783ef723"},{url:"assets/images/galaxy_loading_screen.jpg",revision:"bfc6382cd4d04401eccc60171dca0e70"},{url:"assets/images/info/callisto.jpeg",revision:"3404f1fd4024f0cc8c564a03966c073a"},{url:"assets/images/info/earth.jpeg",revision:"d41b496f59ae3fb840db871a63bd192d"},{url:"assets/images/info/europa.jpeg",revision:"0d7f6ac3e537599bb06333c3cb814492"},{url:"assets/images/info/ganymede.jpeg",revision:"3c11fb8dfc8652c35e1045f383d49943"},{url:"assets/images/info/io.jpeg",revision:"ae4ed3d3445dc4cd72e11e0c8f076e41"},{url:"assets/images/info/jupiter.jpeg",revision:"981d26f171ad61092a1390d2a3c991d1"},{url:"assets/images/info/mars.jpeg",revision:"7b5a74e71e2f1d82a4cb2487a8e3897d"},{url:"assets/images/info/mercury.jpeg",revision:"1ab149cdb0b428ab3fd910308b960d59"},{url:"assets/images/info/moon.jpeg",revision:"4137a42f473a6ec7869e3e7c901eb345"},{url:"assets/images/info/neptune.jpeg",revision:"d48308865a52a76c2104495eb177e033"},{url:"assets/images/info/pluto.jpeg",revision:"7e6da751b8affa3c75a08d80ed0c23ae"},{url:"assets/images/info/saturn.jpeg",revision:"cedf7f8a25354f85f7d70b0a321e9a93"},{url:"assets/images/info/sun.jpeg",revision:"076982d2cdacd0427b5a5e0b7dcc5381"},{url:"assets/images/info/uranus.jpeg",revision:"2e198289073b1b2534872305eb5d6b46"},{url:"assets/images/info/venus.jpeg",revision:"c085e7ed4182d498de50656e3a8d9536"},{url:"assets/images/textures/callisto/1k_callisto.jpeg",revision:"c1f0e92164050e723d931e49bee4c378"},{url:"assets/images/textures/ceres/2k_ceres.jpeg",revision:"f8bb7ef71b1e29a6cabf59dfb6f9e38f"},{url:"assets/images/textures/ceres/4k_ceres.jpeg",revision:"45a7cc6614cfb8b480edf2f2282085c1"},{url:"assets/images/textures/earth/2k/basic.jpeg",revision:"29b7ab155ebd0ddd83d1c89b0ae5503c"},{url:"assets/images/textures/earth/2k/clouds.png",revision:"c3ef93fa361cf3f8ded1f1cd04d9c096"},{url:"assets/images/textures/earth/2k/emission.jpeg",revision:"e6f86547e8abffb4b02afc2865e6942f"},{url:"assets/images/textures/earth/2k/month/april.jpeg",revision:"abc3b23701530f25d423cb19c98a4691"},{url:"assets/images/textures/earth/2k/month/august.jpeg",revision:"d215b0ff144d6bc3f0868b5596d7aa53"},{url:"assets/images/textures/earth/2k/month/december.jpeg",revision:"dc090a419ad06ec98a3ed2bd6991078d"},{url:"assets/images/textures/earth/2k/month/february.jpeg",revision:"e7af3f2ec99c04df66ecb1f701de4b02"},{url:"assets/images/textures/earth/2k/month/january.jpeg",revision:"898564b1779a364167198e80bf3e3d41"},{url:"assets/images/textures/earth/2k/month/july.jpeg",revision:"73c68af86e7931932dda341d0457014b"},{url:"assets/images/textures/earth/2k/month/june.jpeg",revision:"5b2c41fd2eb94213e6feca94b0a126e3"},{url:"assets/images/textures/earth/2k/month/march.jpeg",revision:"1569d91989c27eb66959ccfc4b25e31e"},{url:"assets/images/textures/earth/2k/month/may.jpeg",revision:"b57c12e14e53290227be28ae14ec24b6"},{url:"assets/images/textures/earth/2k/month/november.jpeg",revision:"27d30f9364c6d389de15c2ae93cb2d98"},{url:"assets/images/textures/earth/2k/month/october.jpeg",revision:"670b92744535f71ce5d9b0459ffb3f20"},{url:"assets/images/textures/earth/2k/month/september.jpeg",revision:"199d61683439f4e496cc938049bcb1a3"},{url:"assets/images/textures/earth/2k/night_dark.jpeg",revision:"73d343be0ade106aedd0fb5942db72ba"},{url:"assets/images/textures/earth/2k/normal.jpeg",revision:"dbeb7607d56da2dd274e302b8cf0e2d0"},{url:"assets/images/textures/earth/2k/roughness.jpeg",revision:"c7cb5fe0c1591a857f802149d2f5622a"},{url:"assets/images/textures/earth/2k/specular.jpeg",revision:"9e519a061cf037741a492a8061520e40"},{url:"assets/images/textures/earth/4k/basic.jpeg",revision:"8fffe32c72a77de29409d2a62b59b846"},{url:"assets/images/textures/earth/4k/clouds.png",revision:"82604bceb331dc0b7b7b3c9037d92536"},{url:"assets/images/textures/earth/4k/emission.jpeg",revision:"db91b8415e70693564b4856d067767a8"},{url:"assets/images/textures/earth/4k/month/april.jpeg",revision:"0d2bd5386514111d766466683c529b2c"},{url:"assets/images/textures/earth/4k/month/august.jpeg",revision:"1a733dcd31b002e0fb7cbac8fbd88d78"},{url:"assets/images/textures/earth/4k/month/december.jpeg",revision:"ca6a2c773186202b7eda2ba326d3c9a6"},{url:"assets/images/textures/earth/4k/month/february.jpeg",revision:"ef0b2050359989b9383ca306ec802f9b"},{url:"assets/images/textures/earth/4k/month/january.jpeg",revision:"4e46c206b4bff409b32119ea8f0ea928"},{url:"assets/images/textures/earth/4k/month/july.jpeg",revision:"cdaf0720af6a1adc58842187c43199bd"},{url:"assets/images/textures/earth/4k/month/june.jpeg",revision:"81bc0f657e5dde9e846e2639ad9747a5"},{url:"assets/images/textures/earth/4k/month/march.jpeg",revision:"33aa01f42a4e6a74f95fe481e9c62174"},{url:"assets/images/textures/earth/4k/month/may.jpeg",revision:"e1d416ad73ac8ea46b18c28ba1f22566"},{url:"assets/images/textures/earth/4k/month/november.jpeg",revision:"5947bb3abb1e29cad73cc33fb70088b6"},{url:"assets/images/textures/earth/4k/month/october.jpeg",revision:"d7650aa8252224737be7f9f399207b1e"},{url:"assets/images/textures/earth/4k/month/september.jpeg",revision:"6230f791ce5b97616513c74df3c556e7"},{url:"assets/images/textures/earth/4k/night_dark.jpeg",revision:"aacbceb0ee6df2a122e4a7596863747f"},{url:"assets/images/textures/earth/4k/normal.jpeg",revision:"a353c36d0de9afe2776c7fbd21bda1e2"},{url:"assets/images/textures/earth/4k/roughness.jpeg",revision:"4e5b5064cda762c383df95c39f4b9eda"},{url:"assets/images/textures/earth/4k/specular.jpeg",revision:"38f9d46659bb19a07cacfbf2508e068b"},{url:"assets/images/textures/earth/8k/basic.jpeg",revision:"9499217dd1d3b87ea84f22a0264b1b2c"},{url:"assets/images/textures/earth/8k/emission.jpeg",revision:"3dce408991646d232ddbe5ca2bcac054"},{url:"assets/images/textures/earth/8k/month/april.jpeg",revision:"dbe6eabd553352013407c973ad981185"},{url:"assets/images/textures/earth/8k/month/august.jpeg",revision:"fcfa5fc08a36b77c1524d197e8a16b19"},{url:"assets/images/textures/earth/8k/month/december.jpeg",revision:"aafc3e82f45e33eab3d39e5142b55bb2"},{url:"assets/images/textures/earth/8k/month/february.jpeg",revision:"954b8638a02d6bad1ba10f11e2ddcff9"},{url:"assets/images/textures/earth/8k/month/january.jpeg",revision:"e9e6df46b900977487a0ed9f8362b4e2"},{url:"assets/images/textures/earth/8k/month/july.jpeg",revision:"bff9f6e63f08898bfe7dbd5b9f710b8c"},{url:"assets/images/textures/earth/8k/month/june.jpeg",revision:"33f3dcfe2f1ac1e0f5b43d9c6cea3462"},{url:"assets/images/textures/earth/8k/month/march.jpeg",revision:"5c322584bf28d0b7ee23b9e50e92185c"},{url:"assets/images/textures/earth/8k/month/may.jpeg",revision:"416fd57d08a5e5a981d8253cea1ca390"},{url:"assets/images/textures/earth/8k/month/november.jpeg",revision:"8bb1da67f77ead631c3ae3a227c8f501"},{url:"assets/images/textures/earth/8k/month/october.jpeg",revision:"2cb4fcd2ed386749019345ec9cbb854d"},{url:"assets/images/textures/earth/8k/month/september.jpeg",revision:"a8f8185f693eeb67346c8a8ec03c9702"},{url:"assets/images/textures/earth/8k/night_dark.jpeg",revision:"9fa3cca2f4e00e18c2cca85b300b19e9"},{url:"assets/images/textures/earth/8k/normal.jpeg",revision:"cff7fcce0efc3a69f5518ae36be828b1"},{url:"assets/images/textures/earth/8k/roughness.jpeg",revision:"27a343d79efd605974a05ca3b071c281"},{url:"assets/images/textures/earth/8k/specular.jpeg",revision:"c8ff9f0f130d0bf1a6eeab8bae4d7341"},{url:"assets/images/textures/eris/2k_eris.jpeg",revision:"1697ef30bbd2ab0a6b23c6a69921dced"},{url:"assets/images/textures/eris/4k_eris.jpeg",revision:"d09af55d30e23c152601241d030c836f"},{url:"assets/images/textures/europa/1k_europa.jpeg",revision:"c62c762e03bdff90e858a056da9a330d"},{url:"assets/images/textures/galaxy/2k_stars.jpeg",revision:"d07b3bfc99695724514cf9bebc6d00a9"},{url:"assets/images/textures/galaxy/2k_stars_milky_way.jpeg",revision:"e7a1a6e8a412ee9d70b1dfb32b174524"},{url:"assets/images/textures/galaxy/4k_stars.jpeg",revision:"6f3904d7cc4bea5ca9765f0e48ce98a5"},{url:"assets/images/textures/galaxy/4k_stars_milky_way.jpeg",revision:"7618522c4ee74d0da36690bb705d403c"},{url:"assets/images/textures/galaxy/8k_stars.jpeg",revision:"02c9068d862bb87ae1b2d1915e1c6ba8"},{url:"assets/images/textures/galaxy/8k_stars_milky_way.jpeg",revision:"c6e6844802a5be8bfadbc434cad529b3"},{url:"assets/images/textures/ganymede/1k_ganymede.jpeg",revision:"b06ed8c3cf2dcd52c1b280f48cfb6136"},{url:"assets/images/textures/haumea/2k_haumea.jpeg",revision:"11888d396fa207574993bcfdf810e37f"},{url:"assets/images/textures/haumea/4k_haumea.jpeg",revision:"62df8f4c779cff8a58797bb3fbcec768"},{url:"assets/images/textures/io/2k_io.jpeg",revision:"be7fdd94740a5e00b122f0dd8f8fbcaa"},{url:"assets/images/textures/io/4k_io.jpeg",revision:"d4217532ebb2b263faf74c67c6e87225"},{url:"assets/images/textures/io/8k_io.jpeg",revision:"f715b7ca72b6f3c968413198b1bf74fe"},{url:"assets/images/textures/io/io_stellarium.jpeg",revision:"a2cefe3a9eb67eeaf682e2813e824201"},{url:"assets/images/textures/jupiter/2k_jupiter.jpeg",revision:"bac68e493761c440a887576dd39409c3"},{url:"assets/images/textures/jupiter/4k_jupiter.jpeg",revision:"c147e262013b259c840c2a72c8cf18d4"},{url:"assets/images/textures/makemake/2k_makemake.jpeg",revision:"95c4d4d7665f2b7aa7f5079bb09668bd"},{url:"assets/images/textures/makemake/4k_makemake.jpeg",revision:"220997ea1844f3cbd08f86e4cae17da5"},{url:"assets/images/textures/mars/1k_mars_normal.jpeg",revision:"8f1f3403f75349d9ea95094e104dc8c6"},{url:"assets/images/textures/mars/2k_mars.jpeg",revision:"b30dc37a707e6b4fc18da6de15997b95"},{url:"assets/images/textures/mars/4k_mars.jpeg",revision:"5cc96ea8154bad5dc8c2c78a8a2fd683"},{url:"assets/images/textures/mars/8k_mars.jpeg",revision:"b1404cfbacc5e3e4c08fd7ae1472d807"},{url:"assets/images/textures/mercury/2k_mercury.jpeg",revision:"6e2825332ce2838939ae17f230412466"},{url:"assets/images/textures/mercury/4k_mercury.jpeg",revision:"df426be4f93e00cd916f04747fddb9ca"},{url:"assets/images/textures/mercury/8k_mercury.jpeg",revision:"05a75c74da22211353a8dd64c4ad6172"},{url:"assets/images/textures/moon/2k_moon.jpeg",revision:"9b2b714bfed395a0815aaa9fd33c7a67"},{url:"assets/images/textures/moon/2k_moon_normal.jpeg",revision:"300223c6a2ff4c51d9a2dadaba21728d"},{url:"assets/images/textures/moon/2k_moon_normal.png",revision:"c37c16a8f1a8e04bce1879776b77973d"},{url:"assets/images/textures/moon/4k_moon.jpeg",revision:"ed33e62078278328805bdf99c6275c7f"},{url:"assets/images/textures/moon/8k_moon.jpeg",revision:"c5d7b31c3a2485e00cb8a3c16c91bb07"},{url:"assets/images/textures/neptune/2k_neptune.jpeg",revision:"17c1bff0c64a6a511e7ae707b660bf0f"},{url:"assets/images/textures/pluto/1k_pluto.jpeg",revision:"58971884cb0d18f2b30fd8d20580f7a6"},{url:"assets/images/textures/pluto/1k_pluto_bump.jpeg",revision:"634292d43428c4dd8e3916c3de674096"},{url:"assets/images/textures/pluto/2k_pluto.jpeg",revision:"ee7eb380d570674fb1a47c326c8687b2"},{url:"assets/images/textures/pluto/2k_pluto_bump.jpeg",revision:"5de70ac3872aab9cf9c994cb9e5aa3a2"},{url:"assets/images/textures/saturn/2k_saturn.jpeg",revision:"e758b798d7d9622429374b804940e77f"},{url:"assets/images/textures/saturn/2k_saturn_ring_alpha.png",revision:"deeecd9f9f03ecbff7e0ba4f0b91201a"},{url:"assets/images/textures/saturn/4k_saturn.jpeg",revision:"278f00b03257d7d35c7701f85d2d38e4"},{url:"assets/images/textures/saturn/4k_saturn_ring_alpha.png",revision:"bc69205b5057b880fe930264a36f85d9"},{url:"assets/images/textures/saturn/8k_saturn_ring_alpha.png",revision:"becbcb3c74429e522b2c83a8e4c811d0"},{url:"assets/images/textures/star16x16.png",revision:"cea32dacbac661bb07d7c391e20d599a"},{url:"assets/images/textures/uranus/2k_uranus.jpeg",revision:"0465fbad731bbca3d6c88d36ee524a1c"},{url:"assets/images/textures/venus/2k_venus_atmosphere.jpeg",revision:"cb5877bec89f723cec7d30742fcf105d"},{url:"assets/images/textures/venus/2k_venus_surface.jpeg",revision:"f3fc899218b29c879af0976bbd78bd25"},{url:"assets/images/textures/venus/4k_venus_atmosphere.jpeg",revision:"7d3bef348a66ccfa3c7ebea7394c3f53"},{url:"assets/images/textures/venus/4k_venus_surface.jpeg",revision:"de0fb3ab0d36f95476daaebfc858d7d9"},{url:"assets/images/textures/venus/8k_venus_surface.jpeg",revision:"814a29210ee5cf9a88ed2ec6417baaa0"},{url:"data/orbit_points.txt",revision:"d37ef686aee5a1750b0fb1d51ac056ee"},{url:"data/stars_hyg_v35.csv",revision:"f556f851223120bff77f166b6bcfad88"},{url:"favicon.png",revision:"0e349cb9000532d4698471bd783ef723"},{url:"index.html",revision:"95c2e1fb3f3e4164c7154bb0a7a12340"},{url:"main.89eec8d9598653e54aba.js",revision:null},{url:"main.css",revision:"4e5ca5ce16e9f421783fa6cccefe0082"},{url:"manifest.json",revision:"3bbea7c42afe5a21f8c86eb8b1a02aa1"},{url:"robots.txt",revision:"93d4c6d3ae910ccaf65866570797c3a6"},{url:"runtime.f2084bbf82aa823ce62d.js",revision:null},{url:"style.css",revision:"5ed9ba544bfddf4e4469ed1960df3964"},{url:"vendors.e0f4847df3ae0405da99.js",revision:null},{url:"vendors.e0f4847df3ae0405da99.js.LICENSE.txt",revision:"cbb8321e369caa6be3e4747303833d4a"}],{})}));
