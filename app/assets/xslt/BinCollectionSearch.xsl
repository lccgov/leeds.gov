<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes"/>
    <xsl:template match="/">
      <div class="">
      <xsl:if test="count(/BinRoutes/Routes/BlackBin/Bin) > 0">
        <div class="selectedContainer">
          <h3><img src="/_catalogs/masterpage/public/images/bins_black.svg" alt="Black bin icon"></img>Black bin collection days</h3>
          <div id="divBlackBin">
          <ul class="binCollectionTimesList">
          <xsl:for-each select="BinRoutes/Routes/BlackBin/Bin">
            <xsl:choose>
              <xsl:when test="@IsHiddenFromPage"> <!-- then i test if the attr exists -->
                  <li class="hideFromScreen">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:when>
              <xsl:otherwise>
                  <li class="">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:otherwise>
            </xsl:choose>
           
          </xsl:for-each>
           </ul>
           <p><a href="/bins-waste-and-recycling/your-bins/black-bin">What goes in the black bin?</a></p>
            </div>
        
        </div>
      </xsl:if>
      <xsl:if test="count(/BinRoutes/Routes/BrownBin/Bin) > 0">
        <div class="selectedContainer">
          <h3>
            <img src="/_catalogs/masterpage/public/images/bins_brown.svg" alt="Brown bin icon"></img>Brown bin collection days</h3>
          <div id="divBrownBin">
          <ul class="binCollectionTimesList">
          <xsl:for-each select="BinRoutes/Routes/BrownBin/Bin">

            <xsl:choose>
              <xsl:when test="@IsHiddenFromPage"> <!-- then i test if the attr exists -->
                  <li class="hideFromScreen">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:when>
              <xsl:otherwise>
                  <li class="">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:otherwise>
            </xsl:choose>

          </xsl:for-each>
         </ul>
         <p><a href="/bins-waste-and-recycling/your-bins/brown-garden-waste-bin">What goes in the brown bin?</a></p>
            </div>
        </div>
      </xsl:if>
      <xsl:if test="count(/BinRoutes/Routes/GreenBin/Bin) > 0">
        <div class="selectedContainer">
          <h3>
            <img src="/_catalogs/masterpage/public/images/bins_green.svg" alt="Green bin icon"></img>Green bin collection days</h3>
          <div id="divGreenBin">
          <ul class="binCollectionTimesList">
          <xsl:for-each select="BinRoutes/Routes/GreenBin/Bin">

           <xsl:choose>
              <xsl:when test="@IsHiddenFromPage"> <!-- then i test if the attr exists -->
                  <li class="hideFromScreen">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:when>
              <xsl:otherwise>
                  <li class="">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:otherwise>
            </xsl:choose>

          </xsl:for-each>
          </ul>
          <p><a href="/bins-waste-and-recycling/your-bins/green-recycling-bin">What goes in the green bin?</a></p>
            </div>
        </div>
      </xsl:if>
      <xsl:if test="count(/BinRoutes/Routes/FoodWasteBin/Bin) > 0">
          <div class="selectedContainer">
            <h3>
              <img src="/_catalogs/masterpage/public/images/bins_blue.svg"></img>Food waste bin collection days
            </h3>
            
           <div id="divBlueBin">
          <ul class="binCollectionTimesList">
              <xsl:for-each select="BinRoutes/Routes/FoodWasteBin/Bin">

                <xsl:choose>
              <xsl:when test="@IsHiddenFromPage"> <!-- then i test if the attr exists -->
                  <li class="hideFromScreen">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:when>
              <xsl:otherwise>
                  <li class="">
                    <xsl:value-of select="@RouteDate"/>
                  </li>
              </xsl:otherwise>
            </xsl:choose>

              </xsl:for-each>
           </ul>
           <p><a href="/bins-waste-and-recycling/your-bins/food-waste-bin">What goes in the blue bin?</a></p>
            </div>                            

          </div>
        </xsl:if>
      </div>
    </xsl:template>
</xsl:stylesheet>
