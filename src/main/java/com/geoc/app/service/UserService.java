package com.geoc.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.stereotype.Service;

import com.geoc.app.model.ConnectedUser;
import com.geoc.app.repository.UserRepository;

@Service
public class UserService {
	  @Autowired 
	  UserRepository repo;
	  
	  public void saveUser(ConnectedUser user){
		  repo.save(user);
	  }
	  
	  public GeoResults<ConnectedUser> getUsersNearBy(ConnectedUser user){
		 return repo.findByLocationNear(user.getLocation(),new Distance(1, Metrics.KILOMETERS));
	  }

}
