% MATLAB code by gammaburst on sourceforge.net:
% https://sourceforge.net/p/stellarium/discussion/278769/thread/00fea5e1/#0f6d/ffb1/d1f9/b21b/8d00

% Convert Milky Way image from galactic coords to J2000 equatorial coords for Stellarium 0.13
clear all;
A = imread('8k_stars_milky_way.jpg');  % milky way stretches horizontally across image, centered on galactic core, magellanic clouds in upper-right quadrant
tempfile = 'temp.m';
fout = fopen(tempfile, 'w');
  fprintf(fout,'function U = wedge_rev(X,t);\n');
  fprintf(fout,'[x,y,z] = sph2cart(X(:,1), X(:,2), 1);  %% azimuth elevation range to xyz\n');
  fprintf(fout,'%% stellarium needs equatorial image, so build galactic-to-equatorial rotation matrix using J2000 coords from http://dictionary.sensagent.com/Galactic%%20latitude/en-en/\n');
  fprintf(fout,'r =     rotz(180-192.859508);  %% NGP RA,      positive right-shifts output image\n');
  fprintf(fout,'r = r * rotx(90-27.128336);    %% NGP Dec,     positive increases tilt of galactic plane\n');
  fprintf(fout,'r = r * rotz(122.932-90);      %% Zero of Lon, positive right-shifts galaxy along its plane\n');
  fprintf(fout,'m = [x y z] * r;    %% apply rotation\n');
  fprintf(fout,'[az,el,r] = cart2sph(m(:,1),m(:,2),-m(:,3));\n');
  fprintf(fout,'U = [az el];\n');
fclose(fout);
T = maketform('custom', 2, 2, [], @temp, []);
B = imtransform(A,T,makeresampler('cubic','circular'), 'UData',[-pi pi],'VData',[-pi/2 pi/2], 'XData',[-pi pi],'YData',[-pi/2 pi/2], 'Size',[4096 8192]);  % circular avoids black line at boundary, output azimuth elevation, input azimuth elevation, output height width
delete(tempfile);
imwrite(B,'8k_stars_milky_way_tilted.jpg');  % milky way begins at left-center, curves up high, then curves down low with galactic core somewhat below image center, then curves up to right-center, large magellanic cloud near lower-left corner