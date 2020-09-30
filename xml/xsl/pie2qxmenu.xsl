<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:variable name="newpar">
    <xsl:text>
</xsl:text>
  </xsl:variable>
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="pie">
    <xsl:text>
var arrTree = [
</xsl:text>
    <xsl:apply-templates/>
    <xsl:text>
];
</xsl:text>
  </xsl:template>
  <xsl:template match="section[not(@valid='no')]">
    <xsl:value-of select="concat('{strHeader: &quot;',normalize-space(h),'&quot; ',$newpar)"/>
    <!-- -->
    <xsl:if test="count(section) &gt; 0 or count(list/p) &gt; 0">
      <xsl:value-of select="concat(', arrChild: [',$newpar)"/>
      <xsl:apply-templates select="section"/>
      <xsl:apply-templates select="list/p">
        <xsl:with-param name="str_parent">
          <xsl:value-of select="generate-id(.)"/>
        </xsl:with-param>
      </xsl:apply-templates>
      <xsl:value-of select="concat('],',$newpar)"/>
    </xsl:if>
    <xsl:value-of select="concat('},',$newpar)"/>
  </xsl:template>
  <xsl:template match="p">
    <xsl:param name="str_parent"/>
    <xsl:value-of select="concat('{type : &quot;Test&quot;, strHeader: &quot;',normalize-space(.),'&quot;')"/>
    <xsl:if test="link/@href">
      <xsl:value-of select="concat(', url: ', '&quot;',link/@href, '&quot;')"/>
    </xsl:if>
    <!-- inherit all attributes -->
    <xsl:for-each select="ancestor-or-self::*[name()='section' or name()='list' or name()='p']">
      <xsl:for-each select="@*">
        <xsl:value-of select="concat(', ',name(),': &quot;',.,'&quot;')"/>
      </xsl:for-each>
    </xsl:for-each>
    <xsl:value-of select="concat('},',$newpar)"/>
  </xsl:template>
  <xsl:template match="text()|node()">
    <!-- ignore normal nodes and text nodes -->
  </xsl:template>
</xsl:stylesheet>
