package com.geoc.app.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class ConnectedUser {
	
	
	private String ipRoute;
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
	private String nickName;

}
