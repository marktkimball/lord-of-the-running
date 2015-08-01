(function() {
  'use strict';
  angular
    .module('map')
    .controller('MapTypeImageCtrl', function($scope, $rootScope) {

$scope.map = {
  center: {
    latitude: -39.29687499999999,
    longitude: 60.25917308828177
  }
}

$scope.click = function(event){
  console.log(event.latLng.G + ', ' + event.latLng.K);
}

var frodoTotalJourneyCoordinates = [
  [76.3518964311259, -107.490234375], //SHIRE, 0%
  [75.82365950624266, -105.97824096679688],
  [75.40885422846455, -105.18722534179688],
  [75.05035357407698, -104.83566284179688],
  [75.14077784070429, -101.84738159179688], //WOODY END
  [75.88809074612949, -99.56222534179688], //CRICKHOLLOW
  [75.71563324165896, -98.94699096679688], //OLD FOREST
  [75.80211845876494, -97.27706909179688],
  [75.80211845876494, -94.99191284179688],
  [75.6504309974655, -92.79464721679688],
  [75.45307133006602, -91.65206909179688], //BARROW DOWNS
  [75.342281944273, -89.54269409179688],
  [75.73730278940472, -89.36691284179688],
  [76.07966773378998, -88.40011596679688], //BREE
  [76.47577254009317, -87.69699096679688],
  [76.86081041605962, -86.81808471679688],
  [77.17668402976393, -84.97238159179688],
  [76.98014914976217, -83.30245971679688],
  [76.82079252543741, -81.28097534179688],
  [76.6801567168, -80.0157728990016],
  [76.551678710, -78.913578220],
  [76.43460358351302, -77.32589721679688],
  [76.63922560965885, -76.09542846679688], //12.5%
  [76.70001918871924, -74.86495971679688], //WEATHERTOP
  [76.63922560965885, -73.72238159179688],
  [76.47577254009317, -73.10714721679688],
  [76.37261948220726, -72.49191284179688],
  [76.28954161916207, -71.96456909179688],
  [76.2059670431415, -71.61300659179688],
  [76.10079606754579, -70.82199096679688],
  [75.99483913802065, -70.47042846679688],
  [75.95223506623554, -70.11886596679688],
  [75.7805453532386, -69.85519409179688],
  [75.84516854027044, -68.44894409179688],
  [75.97355295343338, -67.39425659179688],
  [76.10079606754579, -66.60324096679688],
  [76.22690740640384, -65.37277221679688],
  [76.3518964311259, -64.23019409179688],
  [76.51681887717322, -63.175506591796875],
  [76.9206135182968, -61.681365966796875],
  [76.9999351181161, -60.011444091796875], //EAST BRIDGE
  [77.07878389624943, -55.616912841796875],
  [77.17668402976393, -51.925506591796875],
  [76.86081041605962, -48.058319091796875],
  [76.53729617099738, -46.739959716796875], //FORD OF BRUINEN
  [76.57815922398312, -45.421600341796875], //25%, ENTERING RIVENDALE
  [76.9007089258869, -44.191131591796875], //RIVENDALE
  [76.43460358351302, -44.894256591796875],
  [76.31035754301745, -44.982147216796875],
  [76.07966773378998, -44.454803466796875],
  [75.95223506623554, -44.103240966796875],
  [75.7805453532386, -43.663787841796875],
  [75.62863223279015, -43.575897216796875],
  [75.49715731893085, -43.488006591796875],
  [75.29773546875684, -43.575897216796875],
  [75.18578927942625, -43.751678466796875],
  [75.00494000767517, -43.927459716796875],
  [74.86788912917916, -44.103240966796875],
  [74.72961516378619, -44.279022216796875],
  [74.49641311694307, -44.718475341796875],
  [74.35482803013984, -44.894256591796875],
  [74.23587806874863, -45.070037841796875],
  [74.0437225981325, -45.421600341796875],
  [73.89811065820952, -45.597381591796875],
  [73.60299628304274, -45.773162841796875],
  [73.30262420189155, -46.036834716796875],
  [73.04823634299835, -46.300506591796875], //37.5%
  [72.91963546581482, -47.179412841796875],
  [72.79008827319015, -48.146209716796875],
  [72.55449849665266, -49.464569091796875],
  [72.28906720017675, -49.200897216796875],
  [72.10094360009953, -48.234100341796875],
  [71.88357830131247, -47.267303466796875], //REDHORN PASS START
  [72.28906720017675, -44.103240966796875],
  [72.58082870324515, -40.148162841796875], //TIP OF FAILED MTN PASS
  [72.28906720017675, -44.103240966796875],
  [71.68357830131247, -47.667303466796875], //RETURN TO HOLLIN AFTER FAILED MTN PASS
  [71.21607526596131, -48.849334716796875],
  [70.64176873584621, -50.167694091796875],
  [69.8698915662856, -49.640350341796875],
  [69.53451763078358, -47.618865966796875], //ENTER MORIA
  [69.77895177646758, -47.179412841796875],
  [69.99053495947655, -46.036834716796875],
  [70.08056215839737, -44.454803466796875],
  [69.96043926902487, -42.960662841796875], //GANDOLF FALLS FROM BRIDGE WITH BALROG
  [69.56522590149099, -41.466522216796875], //ENTER DRIMRILL DALE, GAZE MIRRORMERE
  [69.03714171275197, -39.884490966796875],
  [68.56038368664157, -39.005584716796875],
  [67.941650035336, -38.654022216796875], //REACH RIVER NIMRODEL
  [67.87554134672945, -37.511444091796875], //ENTER LORIEN 50%
  [67.90861918215302, -36.105194091796875],
  [67.474922384787, -33.292694091796875],
  [67.20403234340081, -31.886444091796875], //STAY IN LORIEN
  [66.47820814385636, -29.689178466796875], //LEAVE LORIEN
  [66.01801815922042, -29.073944091796875],
  [65.54936668811527, -29.073944091796875],
  [64.92354174306496, -28.634490966796875],
  [64.66151739623561, -27.843475341796875],
  [64.24156177916, -26.00015617179],
  [63.93737246791484, -24.415740966796875],
  [63.637371617017, -23.40157170],
  [62.95522304515911, -22.306365966796875],
  [62.87518837993309, -20.636444091796875],
  [62.63376960786813, -18.966522216796875],
  [62.2679226294176, -18.790740966796875],
  [61.77312286453148, -18.966522216796875],
  [61.10078883158897, -20.372772216796875],
  [60.45721779774397, -20.372772216796875],
  [59.7563950493563, -19.845428466796875],
  [59.5343180010956, -18.263397216796875],
  [59.977005492196, -16.417694091796875],
  [60.02095215374802, -14.923553466796875], //62.5%
  [58.90464570302001, -14.132537841796875],
  [57.79794388498275, -16.945037841796875],
  [56.65622649350222, -16.593475341796875],
  [56.022948079627454, -14.044647216796875],
  [54.92714186454645, -13.429412841796875],
  [54.059387886623576, -13.605194091796875],
  [53.4357192066942, -14.747772216796875],
  [52.53627304145945, -15.450897216796875],
  [51.9864759, -15.68],
  [51.28940590271679, -15.802459716796875],
  [50.736455137010665, -15.187225341796875],
  [50.33663539, -15.139456161708],
  [49.89463439573421, -15.099334716796875],
  [49.32512199104001, -14.484100341796875],
  [49.03786794532644, -14.220428466796875],
  [48.574789910928864, -13.956756591796875],
  [47.45780853075031, -13.429412841796875], //Argonath on river
  [46.37725420510028, -13.077850341796875],
  [45.336701909968106, -13.429412841796875], //BREAK OF FELLOWSHIP
  [45.583289756006316, -13.780975341796875],
  [46.01222384063236, -11.583709716796875],
  [47.57652571374621, -10.968475341796875],
  [48.22467264956519, -8.419647216796875],//EMYN MUIL 75%
  [48.10743118848038, -6.15234375],
  [48.3416461723746, -5.519256591796875],
  [47.989921667414166, -3.058319091796875], //START DEAD MARSHES
  [47.15984001304432, -1.564178466796875],
  [46.92025531537451, -0.773162841796875],
  [46.6795944656402, 0.369415283203125],
  [46.13417004624326, 1.599884033203125],
  [45.89000815866182, 2.742462158203125],
  [46.195042108660154, 3.885040283203125], //END OF DEAD MARSHES
  [46.37725420510028, 5.027618408203125],
  [46.4378568950242, 5.730743408203125],
  [46.49839225859763, 6.521759033203125],
  [46.37725420510028, 7.488555908203125],
  [46.07323062540838, 8.191680908203125], //Morannon or BLACK GATE
  [45.521743896993634, 5.730743408203125],
  [43.644025847699496, 3.621368408203125],
  [41.96765920367816, 3.006134033203125],
  [39.0959629363055, 2.654571533203125],
  [36.52729481454624, 3.181915283203125], //FARAMIR TAKES FRODO TO Henneth Annûn
  [34.23451236236987, 3.709259033203125],
  [32.76880048488168, 3.885040283203125],
  [30.675715404167743, 3.797149658203125], //87.5% - MORGUL ROAD
  [30.675715404167743, 4.939727783203125],
  [31.653381399664, 5.642852783203125],
  [31.42866311735861, 6.609649658203125], //STRAIGHT STAIRS AT MINAS MORGUL
  [31.95216223802497, 7.31277465820312], //SHELOB'S LAIR
  [31.95216223802497, 8.191680908203125],
  [31.50362930577303, 8.806915283203125], //Tower of Cirith Ungol
  [31.50362930577303, 9.806915283203125],
  [31.50362930577303, 10.806915283203125],
  [31.50362930577303, 11.619415283203125], //START ON MORGAI
  [33.063924198120645, 12.498321533203125],
  [35.67514743608467, 11.795196533203125],
  [37.43997405227057, 11.531524658203125],
  [38.8225909761771, 11.267852783203125],
  [40.58058466412764, 8.719024658203125],
  [40.3130432088809, 11.267852783203125],
  [40.78054143186031, 12.849884033203125], //ISENMOUTHE
  [40.111688665595956, 15.047149658203125], //BEGIN BARAD-DUR ROAD
  [40.17887331434696, 16.892852783203125],
  [39.977120098439634, 18.826446533203125],
  [39.639537564366684, 20.408477783203125],
  [38.27268853598097, 20.847930908203125],
  [36.52729481454624, 20.584259033203125],
  [35.60371874069731, 19.51171875] //RING IN MT DOOM, 100%
];

var currentJourneyPosition = Math.floor(($rootScope.user.totalMiles  * 0.000621371 / 1800) * frodoTotalJourneyCoordinates.length);
$scope.frodoJourneyCoordinates = frodoTotalJourneyCoordinates.slice(0, currentJourneyPosition);

//5.04257 ME miles to 1 mile ratio to get accurate distance of 1800 miles, each point roughly 10 miles

    });
})();
