<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
    <div class="section">
      <h2>Schools</h2>
      <ul>
        <xsl:for-each select="Schools/School">
          <li>
            <div class="colOne">
              <p> <xsl:value-of select="Status"/>
            </p>
              <div class="closureDates">
                 <xsl:value-of select="StartDate"/> to <xsl:value-of select="EndDate"/>
              </div>

              <div class="lastUpdated">
                <strong>Last updated: </strong>
                 <xsl:value-of select="LastUpdated"/>
              </div>

            </div>
            <h3>
              <xsl:value-of select="Name"/>
            </h3>

            <p>
              <xsl:value-of select="Comments"/>
            </p>
            <div class="clear"></div>
          </li>
        </xsl:for-each>
      </ul>
    </div> 
  </xsl:template>
</xsl:stylesheet>
