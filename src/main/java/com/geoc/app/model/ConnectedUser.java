package com.geoc.app.model;

import java.util.Map;

import javax.json.JsonValue;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection="g_users")
public class ConnectedUser implements JsonValue {
	
	private Boolean isChatting;
	@Id
	private String ipRoute;
	
	@Transient
	private Map<String,Double> coOrd;
	
	public Map<String, Double> getCoOrd() {
		return coOrd;
	}
	public void setCoOrd(Map<String, Double> coOrd) {
		this.coOrd = coOrd;
	}
	
	
	@JsonIgnore
	@GeoSpatialIndexed
	private Point location;
	
	public String getIpRoute() {
		return ipRoute;
	}
	public void setIpRoute(String ipRoute) {
		this.ipRoute = ipRoute;
	}
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public String getTagLine() {
		return tagLine;
	}
	public void setTagLine(String tagLine) {
		this.tagLine = tagLine;
	}
	public Boolean getIsChatting() {
		return isChatting;
	}
	public void setIsChatting(Boolean isChatting) {
		this.isChatting = isChatting;
	}
	public Point getLocation() {
		return location;
	}
	public void setLocation(Point location) {
		this.location = location;
	}
	private String nickName;
	
	private String tagLine;

	public ValueType getValueType() {		
		return ValueType.OBJECT;
	}

}
