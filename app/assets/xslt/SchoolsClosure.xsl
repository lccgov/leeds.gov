<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
  <div>
    <xsl:for-each select="Schools/School">
      <div class="description-list">
        <h2 class="description-list__heading"><xsl:value-of select="Name"/></h2>
        <div class="description-list__item">
            <h3>Reason for <span class="sr-only"><xsl:value-of select="Name"/></span> closure</h3>
            <div class="description-list__item-content">
                <p><xsl:value-of select="Status"/></p>
            </div>
            <div class="clear"></div>
        </div>
        <div class="description-list__item">
            <h3>Comments <span class="sr-only">for <xsl:value-of select="Name"/></span></h3>
            <div class="description-list__item-content">
                <p><xsl:value-of select="Comments"/></p>
            </div>
            <div class="clear"></div>
        </div>
        <div class="description-list__item">
            <h3><span class="sr-only">The date <xsl:value-of select="Name"/> is</span>Closed from</h3>
            <div class="description-list__item-content">
                <p><xsl:value-of select="StartDate"/></p>
            </div>
            <div class="clear"></div>
        </div>
        <div class="description-list__item">
            <h3><span class="sr-only">The date <xsl:value-of select="Name"/></span>Opens on</h3>
            <div class="description-list__item-content">
                <p><xsl:value-of select="EndDate"/></p>
            </div>
            <div class="clear"></div>
        </div>
        <div class="description-list__item">
            <h3><span class="sr-only"><xsl:value-of select="Name"/> was </span>Last updated <span class="sr-only">on</span></h3>
            <div class="description-list__item-content">
                <p><xsl:value-of select="LastUpdated"/></p>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>