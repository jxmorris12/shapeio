//
// created by Jack Morris, May 2016
// adapted from Torbert, April 2014
//
// listen for resize
   // https://jsfiddle.net/jaredwilli/qFuDr/
var c = document . getElementById( 'myCanvas' ) ;
window.addEventListener('resize', resizeCanvas, false); 
//
function resizeCanvas() {
   //
   c.width = window.innerWidth;
   c.height = window.innerHeight;
   //
   WIDTH  = c.width;
   HEIGHT = c.height;
   //
}
//
// constants
// var WIDTH  = 1500 ;
// var HEIGHT = 1000 ;
resizeCanvas();
//
var NUMWB =  050    ;
var DT    =    0.05 ;
var MINV  =   10.0  ;
var MAXV  =   20.0  ;
var CYCLE = 3000    ;
//
var MY_X = WIDTH  / 2 ;
var MY_Y = HEIGHT / 2 ;
//
var MY_COLOR = "#3E3"; // green
var NOT_MY_COLOR = "#FFFF00" ; // yellow
//
var M_PI = Math.PI ;
//
var color ;
//
function cos( x )
{
   return Math . cos( x )
}
function sin( x )
{
   return Math . sin( x )
}
function atan2( y , x )
{
   return Math . atan2( y , x )
}
function i( x )
{
   return Math . round( x )
}
function mydist( x1 , y1 , x2 , y2 )
{
   var dx ;
   var dy ;
   //
   dx = x2 - x1 ;
   dy = y2 - y1 ;
   //
   return Math . sqrt( dx*dx + dy*dy ) ;
}
function myrand( )
{
   return Math . random() ;
}
function myrandrange( rmin , rmax )
{
   return rmin + ( rmax - rmin ) * myrand() ;
}
//
function Wildebeest()
{
   this . x  = 0 ;
   this . y  = 0 ;
   this . t  = 0 ;
   this . v  = 0 ;
   this . dt = 0 ;
   this . dv = 0 ;
   this . R  = 0 ;
   this . r  = 0 ;
}
//
function Stats()
{
   this . alone   = 0 ;
   this . angry   = 0 ;
   this . other   = 0 ;
   this . total   = 0 ;
   //
   this . avgsize = 0 ;
   this . avgnbrs = 0 ;
}
//
// http://stackoverflow.com/questions/4839993/how-to-draw-polygons-on-an-html5-canvas
//
function poly( canvas , x , y , n , color )
{
   var ctx = canvas . getContext( '2d' ) ;
   //
   ctx . strokeStyle = color ;
   ctx . fillStyle   = color ;
   //
   var j ;
   //
   ctx . beginPath() ;
   //
   ctx . moveTo( x[0] , y[0] ) ;
   //
   j = 1 ;
   while( j < n )
   {
      ctx . lineTo( x[j] , y[j] ) ;
      //
      ++j ;
   }
   //
   ctx . closePath() ;
   //
   ctx . fill() ;
}
//
function line( canvas , x1 , y1 , x2 , y2 , color )
{
   var ctx = canvas . getContext( '2d' ) ;
   //
   ctx . strokeStyle = color ;
   ctx . fillStyle   = color ;
   //
   ctx . beginPath() ;
   //
   ctx . moveTo( x1 , y1 ) ;
   //
   ctx . lineTo( x2 , y2 ) ;
   //
   ctx . closePath() ;
   //
   ctx . stroke() ;
}
//
function movewildebeest()
{
   var    j,k,i;
   var    count;
   //
   var dxavg;
   var dyavg;
   //
   var dx,dy;
   //
   var    quad1;
   var    quad2;
   //
   var tavg;
   var vavg;
   //
   var    turnleft;
   var    slowdown;
   //
   var    coinflip;
   //
   for( j=0 ; j<NUMWB ; j++ )
   {
      //
      arr[j].t += arr[j].dt ;
      arr[j].v += arr[j].dv ;
      //
      if( arr[j].t > 2.0 * M_PI ) arr[j].t -= 2.0 * M_PI ; // wrap
      if( arr[j].t < 0.0        ) arr[j].t += 2.0 * M_PI ;
      //
      if( arr[j].v < MINV ) arr[j].v = MINV ; // clamp
      if( arr[j].v > MAXV ) arr[j].v = MAXV ;
      //
      //
      //
      arr[j].x  += DT * arr[j].v * cos( arr[j].t ) ;
      arr[j].y  += DT * arr[j].v * sin( arr[j].t ) ;
      //
      if( arr[j].x > WIDTH  ) arr[j].x -= WIDTH  ; // wrap
      if( arr[j].x < 0.0    ) arr[j].x += WIDTH  ;
      if( arr[j].y > HEIGHT ) arr[j].y -= HEIGHT ; // wrap
      if( arr[j].y < 0.0    ) arr[j].y += HEIGHT ;
      //
   }
   //
   for( j=0 ; j<NUMWB ; j++ )
   {
      //
      brr[j].total++;
      //
      k = near[j];
      //
      if( nbrs[ j * NUMWB + k ] == 0 ) // alone... move randomly
      {
         //
         brr[j].alone++;
         //
         arr[j].dt = myrandrange( -1.0/24.0 * M_PI , 1.0/24.0 * M_PI ) ;
         arr[j].dv = myrandrange( -1.0 , 1.0 ) ;
         //
      }
      else
      {
         if( myrandrange(0,1) < 0.5 )
         {
            coinflip = 1 ;
         }
         else
         {
            coinflip = 0 ;
         }
         //
         if( nbrs[ j*NUMWB + k ] == 1 ) // avoid collision
         {
            //
            brr[j].angry++;
            //
            dxavg = 0.0 ;
            dyavg = 0.0 ;
            //
            vavg  = 0.0 ;
            //
            count = 0 ;
            //
            for( i=0 ; i<NUMWB ; i++ )
            {
               if( nbrs[ j * NUMWB + i ] == 1 )
               {
                  dxavg += cos( arr[i].t ) ;
                  dyavg += sin( arr[i].t ) ;
                  //
                  vavg  += arr[i].v ;
                  //
                  count++;
               }
            }
            //
            dxavg /= count ;
            dyavg /= count ;
            //
            tavg   = atan2( dyavg , dxavg ) ;
            //
            if( tavg < 0.0 ) tavg += 2.0 * M_PI ;
            //
            //
            //
            dx     = cos( arr[j].t ) ;
            dy     = sin( arr[j].t ) ;
            //
            if( dx    > 0.0 ) quad1 = ( dy    > 0.0 ) ? 1 : 4 ;
            else              quad1 = ( dy    > 0.0 ) ? 2 : 3 ;
            //
            if( dxavg > 0.0 ) quad2 = ( dyavg > 0.0 ) ? 1 : 4 ;
            else              quad2 = ( dyavg > 0.0 ) ? 2 : 3 ;
            //
            //
            //
            if( quad1 == 1 )
            {
               if( quad2 == 1 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 1 : 0 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 0 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 1 ; // arbitrary convention
                  turnleft = 0 ; // arbitrary convention
                  turnleft = 1 - coinflip ;
               }
               else // quad2 == 4
               {
                  turnleft = 1 ;
               }
            }
            else if( quad1 == 2 )
            {
               if( quad2 == 1 )
               {
                  turnleft = 1 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 1 : 0 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 0 ;
               }
               else // quad2 == 4
               {
                  turnleft = 1 ; // arbitrary convention
                  turnleft = 0 ; // arbitrary convention
                  turnleft = 1 - coinflip ;
               }
            }
            else if( quad1 == 3 )
            {
               if( quad2 == 1 )
               {
                  turnleft = 1 ; // arbitrary convention
                  turnleft = 0 ; // arbitrary convention
                  turnleft = 1 - coinflip ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 1 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 1 : 0 ;
               }
               else // quad2 == 4
               {
                  turnleft = 0 ;
               }
            }
            else // quad1 == 4
            {
               if( quad2 == 1 )
               {
                  turnleft = 0 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 1 ; // arbitrary convention
                  turnleft = 0 ; // arbitrary convention
                  turnleft = 1 - coinflip ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 1 ;
               }
               else // quad2 == 4
               {
                  turnleft = ( arr[j].t > tavg ) ? 1 : 0 ;
               }
            }
            //
            //
            //
            vavg  /= count;
            //
            if( arr[j].v < vavg )
            {
               slowdown = 1 ;
            }
            else
            {
               slowdown = 0 ;
            }
            //
         }
         else // nbrs[ j*NUMWB + k ] == 2
         {
            //
            dxavg = 0.0 ;
            dyavg = 0.0 ;
            //
            vavg  = 0.0 ;
            //
            count = 0 ;
            //
            for( i=0 ; i<NUMWB ; i++ )
            {
               if( nbrs[ j * NUMWB + i ] == 2 && nbrs[ i * NUMWB + near[i] ] != 1 )
               {
                  dxavg += cos( arr[i].t ) ;
                  dyavg += sin( arr[i].t ) ;
                  //
                  vavg  += arr[i].v ;
                  //
                  count++;
               }
            }
            //
            if( count == 0 ) // all my nbrs are angry
            {
               //
               brr[j].alone++;
               //
               arr[j].dt = myrandrange( -1.0/24.0 * M_PI , 1.0/24.0 * M_PI ) ;
               arr[j].dv = myrandrange( -1.0 , 1.0 ) ;
               //
               continue; // skip turnleft slowdown
               //
            }
            //
            brr[j].other++;
            //
            brr[j].avgnbrs = ( brr[j].avgnbrs * ( brr[j].other - 1 ) + count ) / brr[j].other ;
            //
            dxavg /= count ;
            dyavg /= count ;
            //
            tavg   = atan2( dyavg , dxavg ) ;
            //
            if( tavg < 0.0 ) tavg += 2.0 * M_PI ;
            //
            //
            //
            dx     = cos( arr[j].t ) ;
            dy     = sin( arr[j].t ) ;
            //
            if( dx    > 0.0 ) quad1 = ( dy    > 0.0 ) ? 1 : 4 ;
            else              quad1 = ( dy    > 0.0 ) ? 2 : 3 ;
            //
            if( dxavg > 0.0 ) quad2 = ( dyavg > 0.0 ) ? 1 : 4 ;
            else              quad2 = ( dyavg > 0.0 ) ? 2 : 3 ;
            //
            //
            //
            if( quad1 == 1 )
            {
               if( quad2 == 1 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 0 : 1 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 1 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 1 ; // arbitrary convention... bias
                  turnleft = 0 ; // arbitrary convention... bias
                  turnleft = 1 - coinflip ;
               }
               else // quad2 == 4
               {
                  turnleft = 0 ;
               }
            }
            else if( quad1 == 2 )
            {
               if( quad2 == 1 )
               {
                  turnleft = 0 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 0 : 1 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 1 ;
               }
               else // quad2 == 4
               {
                  turnleft = 1 ; // arbitrary convention... bias
                  turnleft = 0 ; // arbitrary convention... bias
                  turnleft = 1 - coinflip ;
               }
            }
            else if( quad1 == 3 )
            {
               if( quad2 == 1 )
               {
                  turnleft = 0 ; // arbitrary convention... bias
                  turnleft = 1 ; // arbitrary convention... bias
                  turnleft = coinflip ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 0 ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = ( arr[j].t > tavg ) ? 0 : 1 ;
               }
               else // quad2 == 4
               {
                  turnleft = 1 ;
               }
            }
            else // quad1 == 4
            {
               if( quad2 == 1 )
               {
                  turnleft = 1 ;
               }
               else if( quad2 == 2 )
               {
                  turnleft = 0 ; // arbitrary convention... bias
                  turnleft = 1 ; // arbitrary convention... bias
                  turnleft = coinflip ;
               }
               else if( quad2 == 3 )
               {
                  turnleft = 0 ;
               }
               else // quad2 == 4
               {
                  turnleft = ( arr[j].t > tavg ) ? 0 : 1 ;
               }
            }
            //
            //
            //
            vavg /= count;
            //
            if( arr[j].v < vavg )
            {
               slowdown = 0 ;
            }
            else
            {
               slowdown = 1 ;
            }
            //
         }
         //
         if( turnleft == 1 )
         {
            arr[j].dt = myrandrange( 0.0 ,  1.0/24.0 * M_PI ) ;
         }
         else
         {
            arr[j].dt = myrandrange( 0.0 , -1.0/24.0 * M_PI ) ;
         }
         //
         if( slowdown == 1 )
         {
            arr[j].dv = myrandrange( 0.0 , -1.0 ) ;
         }
         else
         {
            arr[j].dv = myrandrange( 0.0 ,  1.0 ) ;
         }
         //
      }
   }
} 
// 
function drawONEwildebeest( x , y , t , R , color )
{
   var x1,y1;
   var x2,y2;
   var x3,y3;
   var x4,y4;
   var x5,y5;
   var x6,y6;
   var x7,y7;
   //
   x1 = x + 0.4 * R * cos( t + 0.5 * M_PI ) + 1.2 * R * cos( t + M_PI ) ;
   y1 = y + 0.4 * R * sin( t + 0.5 * M_PI ) + 1.2 * R * sin( t + M_PI ) ;
   //
   x2 = x + 0.4 * R * cos( t + 0.5 * M_PI )                             ;
   y2 = y + 0.4 * R * sin( t + 0.5 * M_PI )                             ;
   //
   x3 = x + 1.0 * R * cos( t + 0.5 * M_PI )                             ;
   y3 = y + 1.0 * R * sin( t + 0.5 * M_PI )                             ;
   //
   x4 = x +       R * cos( t              )                             ;
   y4 = y +       R * sin( t              )                             ;
   //
   x5 = x + 1.0 * R * cos( t - 0.5 * M_PI )                             ;
   y5 = y + 1.0 * R * sin( t - 0.5 * M_PI )                             ;
   //
   x6 = x + 0.4 * R * cos( t - 0.5 * M_PI )                             ;
   y6 = y + 0.4 * R * sin( t - 0.5 * M_PI )                             ;
   //
   x7 = x + 0.4 * R * cos( t - 0.5 * M_PI ) + 1.2 * R * cos( t + M_PI ) ;
   y7 = y + 0.4 * R * sin( t - 0.5 * M_PI ) + 1.2 * R * sin( t + M_PI ) ;
   //
   //
   //
   xp[0] = i( x1 ) ;
   yp[0] = i( y1 ) ;
   xp[1] = i( x2 ) ;
   yp[1] = i( y2 ) ;
   xp[2] = i( x3 ) ;
   yp[2] = i( y3 ) ;
   xp[3] = i( x4 ) ;
   yp[3] = i( y4 ) ;
   xp[4] = i( x5 ) ;
   yp[4] = i( y5 ) ;
   xp[5] = i( x6 ) ;
   yp[5] = i( y6 ) ;
   xp[6] = i( x7 ) ;
   yp[6] = i( y7 ) ;
   //
   poly( c , xp , yp , 7 , color ) ; 
}
// 
function drawwildebeest()
{
   var j;
   //
   var x;
   var y;
   var t;
   //
   var R = 8.0;
   //
   var gx ;
   var gy ;
   //
   var avar ;
   var bvar ;
   //
   for( j=0 ; j<NUMWB ; j++ )
   {
      //
      color = arr[j].color;
      //
      if( nbrs[ j * NUMWB + near[j] ] == 1 ) color = "#FF0000" ; // red
      //
      x  = arr[j].x ;
      y  = arr[j].y ;
      t  = arr[j].t ;
      //
      drawONEwildebeest( x , y , t , R , color ) ;
      //
      gx = ( x > 0.5 * HEIGHT ) ? x - HEIGHT : x + HEIGHT ; // ghost point
      gy = ( y > 0.5 * HEIGHT ) ? y - HEIGHT : y + HEIGHT ;
      //
      avar = x - 1.5 * R < 0 || x + 1.5 * R >= HEIGHT ;
      bvar = y - 1.5 * R < 0 || y + 1.5 * R >= HEIGHT ;
      //
      if( avar )
      {
         drawONEwildebeest( gx ,  y , t , R , color ) ;
      }
      if( bvar )
      {
         drawONEwildebeest(  x , gy , t , R , color ) ;
      }
      if( avar && bvar )
      {
         drawONEwildebeest( gx , gy , t , R , color ) ;
      }
   }
} 
// 
function floodfill(j,num)
{ 
   var k; 
   // 
   if( cc[j] >= 0 ) return ; 
   // 
   cc[j] = num; 
   cn[num]++;
   // 
   for( k=0 ; k<NUMWB ; k++ )
   {
      if( nbrs[ j * NUMWB + k ] == 2 && nbrs[ k * NUMWB + near[k] ] == 2 )
      {
         floodfill(k,num);
      }
   }
}
// 
function nbrswildebeest()
{
   var j,k;
   //
   var x1,y1;
   var x2,y2;
   //
   var rx,ry; // real point
   var gx,gy; // ghost point
   //
   var dist;
   var gist;  // ghost
   var bist;  // best
   //
   for( j=0 ; j<NUMWB ; j++ )
   {
      //
      x1 = arr[j].x ;
      y1 = arr[j].y ;
      //
      bist = -1.0 ;
      //
      near[j] = -1 ;
      //
      for( k=0 ; k<NUMWB ; k++ )
      {
         //
         if( k == j )
         {
            nbrs[ j * NUMWB + k ] = 0 ; // i am not a nbr to myself
            //
            nbrx[ j * NUMWB + k ] = x1 ;
            nbry[ j * NUMWB + k ] = y1 ;
            nbrd[ j * NUMWB + k ] = 0.0 ;
            //
            // do not consider myself as the nearest neighbor
            //
         }
         else
         {
            //
            // real point plus three ghost points
            //
            rx   = arr[k].x ;
            ry   = arr[k].y ;
            gx   = ( rx > 0.5 * HEIGHT ) ? rx - HEIGHT : rx + HEIGHT ;
            gy   = ( ry > 0.5 * HEIGHT ) ? ry - HEIGHT : ry + HEIGHT ;
            //
            x2   = rx ;
            y2   = ry ;
            dist = mydist( x1,y1 , x2,y2 ) ; // start with the real point
            //
            gist = mydist( x1,y1 , rx,gy ) ;
            if( gist < dist )
            {
               x2   = rx ;
               y2   = gy ;
               dist = gist ;
            }
            //
            gist = mydist( x1,y1 , gx,ry ) ;
            if( gist < dist )
            {
               x2   = gx ;
               y2   = ry ;
               dist = gist ;
            }
            //
            gist = mydist( x1,y1 , gx,gy ) ;
            if( gist < dist )
            {
               x2   = gx ;
               y2   = gy ;
               dist = gist ;
            }
            //
            //
            //
            nbrx[ j * NUMWB + k ] = x2 ;
            nbry[ j * NUMWB + k ] = y2 ;
            nbrd[ j * NUMWB + k ] = dist ;
            //
            if( bist < 0.0 || dist < bist )
            {
               //
               bist = dist;
               //
               near[j] = k;
               //
            }
            //
            if( dist < arr[j].R )
            {
               nbrs[ j * NUMWB + k ] = ( dist < arr[j].r ) ? 1 : 2 ;
            }
            else
            {
               nbrs[ j * NUMWB + k ] = 0 ;
            }
            //
         }
         //
      }
      //
   }
} 
// 
function drawnbrs()
{
   var j;
   var k;
   //
   var x1,y1;
   var x2,y2;
   //
   for( j=0 ; j<NUMWB ; j++ )
   {
      //
      x1 = arr[j].x ;
      y1 = arr[j].y ;
      //
      for( k=0 ; k<NUMWB ; k++ )
      {
         //
         if( nbrs[ j * NUMWB + k ] > 0 )
         {
            //
            color = "#FFFF00" ; // yellow
            //
            if( nbrs[ j * NUMWB + k ] == 1 )
            {
               color = "#FF0000" ; // red
            }
            else if( nbrs[ j * NUMWB + near[j] ] == 1 ) // we are angry
            {
               continue ;
            }
            else if( nbrs[ k * NUMWB + near[k] ] == 1 ) // nbr is angry
            {
               continue ;
            }
            //
            x2 = nbrx[ j * NUMWB + k ] ; // may be a ghost point
            y2 = nbry[ j * NUMWB + k ] ;
            //
            line( c , i( x1 ) , i( y1 ) , i( x2 ) , i( y2 ) , color ) ;
            //
         }
         //
      }
      //
   }
} 
//
// http://www.htmlgoodies.com/beyond/javascript/article.php/3709486
//
function tick()
{
   var j = 0 ;
   //
   cycle++;
   //
   if( cycle == CYCLE )
   {
      cycle = 0 ;
      //
      radiu -= 5.0 ; // 20 15 10 30 25 20 15 10 30...
      //
      if( radiu < 7.5 ) radiu = 30.0 ;
      //
      for( j=0 ; j<NUMWB ; j++ )
      {
         arr[j].r = radiu ;
      }
      //
   }
   //
   movewildebeest();
   //
   nbrswildebeest();
   //
   ctx . fillStyle = '#000000' ; // black
   ctx . fillRect( 0 , 0 , c.width , c.height ) ;
   //
   drawwildebeest() ;
   drawnbrs() ;
   //
   ctx . fillStyle = '#000000' ; // black
   ctx . fillRect( HEIGHT , 0 , WIDTH, HEIGHT ) ;
   //
   //
   setTimeout( 'tick()' , 10 ) ;
}
//
function initwildebeest()
{
   var j ;
   var k ;
   //
   cycle = 0 ;
   //
   j = 0 ;
   //
   while( j < NUMWB )
   {
      arr[j] = new Wildebeest() ;
      //
      if(j == 0) {
         // me
         arr[j].x = MY_X;
         arr[j].y = MY_Y;
         //
         arr[j].color = MY_COLOR;
         //
      } else {
         // not me
         arr[j].x     = myrandrange( 0.0  , WIDTH * 2 ) ;
         arr[j].y     = myrandrange( 0.0  , HEIGHT ) ;
         //
         arr[j].color = NOT_MY_COLOR;
         //
      }
      //
      arr[j].t     = myrandrange( 0.0  , 2.0 * M_PI ) ;
      arr[j].v     = 0;
      //
      arr[j].dt    = myrandrange( -1.0/24.0 * M_PI , 1.0/24.0 * M_PI ) ;
      arr[j].dv    = myrandrange( -1.0 , 1.0 ) ;
      //
      arr[j].R     = 40.0 ;
      arr[j].r     = radiu ;
      //
      //
      //
      near[j]      = 0 ;
      //
      //
      //
      brr[j]       = new Stats() ;
      //
      brr[j].alone = 0 ;
      brr[j].angry = 0 ;
      brr[j].other = 0 ;
      brr[j].total = 0 ;     // sum of previous three
      //
      brr[j].avgsize = 0.0 ; // entire component
      brr[j].avgnbrs = 0.0 ; // nearest neighbors
      //
      ++j ;
   }
}
//
var ctx = c . getContext( '2d' ) ;
//
var n = 4 ;
//
var x = [ 100 , 200 , 200 , 100 ] ;
var y = [  50 ,  50 , 250 , 250 ] ;
//
//
//
var arr = new Array() ; // Wildebeests
var brr = new Array() ; // Stats
//
var nbrs = new Array() ;
//
var nbrx = new Array() ;
var nbry = new Array() ;
var nbrd = new Array() ;
//
var near = new Array() ;
//
var cc = new Array() ;
var cn = new Array() ;
//
var cycle ;
//
var radiu = 20.0 ;
//
var xp = new Array() ;
var yp = new Array() ;
//
initwildebeest() ;
//
setTimeout( 'tick()' , 1 ) ;
//
// end of file
//