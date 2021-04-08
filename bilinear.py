import cv2

img = cv2.imread('C:/Users/John/Desktop/git/portfolio/no-webkit.png')

#scale_percent = 99.9 # percent of original size
scale_percent = 99 # percent of original size
width = int(img.shape[1] * scale_percent / 100)
height = int(img.shape[0] * scale_percent / 100)
dim = (width, height) 

bilinear_img = cv2.resize(img,dim, interpolation = cv2.INTER_LINEAR)

cv2.imwrite('webkit.png', bilinear_img)